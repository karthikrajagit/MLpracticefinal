import os
import shutil
import uuid
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Lock
import docker

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

submission_lock = Lock()

allowed_extensions = {'csv', 'json'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/execute', methods=['POST'])
def execute():
    data = request.json
    code = data.get('code', '')
    dataset = data.get('dataset')
    userId = data.get('userId')

    UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'uploads'))
    file_path = os.path.join(UPLOAD_FOLDER, dataset)

    if not os.path.exists(file_path):
        return jsonify({"error": f"Dataset file {dataset} not found."}), 404

    if not allowed_file(dataset):
        return jsonify({"error": "Invalid file type."}), 400

    submission_id = str(uuid.uuid4())
    submission_dir = os.path.join(os.path.abspath('/app/submissions'), submission_id)

    try:
        os.makedirs(submission_dir)
        dataset_path = os.path.join(submission_dir, dataset)
        shutil.copy(file_path, dataset_path)

        script_path = os.path.join(submission_dir, 'script.py')
        with open(script_path, "w", encoding="utf-8") as file:
            container_dataset_path = f"/app/{dataset}"
            file.write(f"DATASET_PATH = '{container_dataset_path}'\n\n") 
            file.write("import os\n\n")
            file.write(code) 

        print(f"Directory contents before running container: {os.listdir(submission_dir)}")
        
        client = docker.from_env()

        container = client.containers.run(
            "code-execution-image", 
            command="python /app/script.py",
            volumes={submission_dir: {'bind': '/app', 'mode': 'rw'}},
            environment={"DATASET_PATH": dataset_path},
            detach=True,  
            mem_limit="512m",  
            cpu_quota=100000,  
            network_mode="none",  
            security_opt=["no-new-privileges"], 
        )

        result = container.wait()
        logs = container.logs().decode()

        if result['StatusCode'] != 0:
            error_message = f"Error in user code: {logs}"
            logging.error(error_message)
            shutil.rmtree(submission_dir)
            return jsonify({"error": error_message, "logs": logs, "submission_id": submission_id, "userId": userId}), 400

        output = logs
        shutil.rmtree(submission_dir)

        return jsonify({"output": output, "submission_id": submission_id, "userId": userId}), 200

    except Exception as e:
        logging.error(f"Error during execution: {str(e)}")
        return jsonify({"error": str(e)}), 500
    


@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    code = data.get('code')
    datasets = data.get('datasets', [])
    expected_outputs = data.get('outputs', [])  
    userId = data.get('userId')

    UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'uploads'))

    # Validate datasets
    if not isinstance(datasets, list) or not datasets:
        return jsonify({"error": "Invalid datasets."}), 400

    # Validate expected outputs
    if len(expected_outputs) != len(datasets):
        return jsonify({"error": "Mismatch between number of datasets and expected outputs."}), 400

    valid_datasets = []
    for dataset in datasets:
        file_path = os.path.join(UPLOAD_FOLDER, dataset)
        if not os.path.exists(file_path):
            return jsonify({"error": f"Dataset file {dataset} not found."}), 404
        if not allowed_file(dataset):
            return jsonify({"error": "Invalid file type."}), 400
        valid_datasets.append(dataset)

    submission_id = str(uuid.uuid4())
    submission_dir = os.path.join(os.path.abspath('/app/submissions'), submission_id)

    try:
        # Create temporary directory for the submission
        os.makedirs(submission_dir)
        i = 0
        for i, dataset in enumerate(valid_datasets):
            # Create dataset-specific directory and copy the dataset
            dataset_path = os.path.join(submission_dir, dataset)
            shutil.copy(os.path.join(UPLOAD_FOLDER, dataset), dataset_path)

            # Modify the user code to handle the current dataset
            script_path = os.path.join(submission_dir, 'script.py')
            with open(script_path, "w") as file:
                container_dataset_path = f"/app/{dataset}"  # Path inside the container
                file.write(f"DATASET_PATH = '{container_dataset_path}'\n\n")
                file.write("import os\n\n")
                file.write(code)

            print(f"Directory contents before running container: {os.listdir(submission_dir)}")

            # Initialize Docker client
            client = docker.from_env()

            # Run the container for the current dataset
            container = client.containers.run(
                "code-execution-image",  # The Docker image for code execution
                command="python /app/script.py",  # Command to run the user code
                volumes={
                    submission_dir: {'bind': '/app', 'mode': 'rw'},  # Mount submission directory to /app inside the container
                },
                detach=True,
                mem_limit="512m",  # Limit memory usage
                cpu_quota=100000,  # Limit CPU usage
                network_mode="none",  # Disable networking
                security_opt=["no-new-privileges"],   # Run the container in detached mode
            )

            # Wait for the container to finish and capture logs
            result = container.wait()
            logs = container.logs().decode()  # Decode logs to string

            # If the status code is non-zero, it indicates an error in the code execution
            if result['StatusCode'] != 0:
                error_message = f"Error in user code: {logs}"
                logging.error(error_message)
                shutil.rmtree(submission_dir)
                return jsonify({"error": error_message, "logs": logs, "userId": userId, "submission_id": submission_id}), 400

            # Log both actual and expected outputs
            actual_output = float(logs.strip()) # Strip any extra spaces or newlines
            expected_output = float(expected_outputs[i].strip()) # Strip any extra spaces or newlines

            # Log both actual and expected outputs
            logging.info(f"Actual output: {actual_output}")
            logging.info(f"Expected output: {expected_output}")

        shutil.rmtree(submission_dir)

        return jsonify({"status": "success", "submission_id": submission_id, "userId": userId}), 200

    except Exception as e:
        logging.error(f"Error during submission: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/runcode', methods=['POST'])
def runcode():
    data = request.json
    code = data.get('code', '')
    dataset = data.get('dataset')
    userId = data.get('userId')

    UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'userdataset'))
    file_path = os.path.join(UPLOAD_FOLDER, dataset)

    if not os.path.exists(file_path):
        return jsonify({"error": f"Dataset file {dataset} not found."}), 404

    if not allowed_file(dataset):
        return jsonify({"error": "Invalid file type."}), 400

    submission_id = str(uuid.uuid4())
    submission_dir = os.path.join(os.path.abspath('/app/submissions'), submission_id)

    try:
        os.makedirs(submission_dir)
        dataset_path = os.path.join(submission_dir, dataset)
        shutil.copy(file_path, dataset_path)

        script_path = os.path.join(submission_dir, 'script.py')
        with open(script_path, "w", encoding="utf-8") as file:
            container_dataset_path = f"/app/{dataset}"
            file.write(f"DATASET_PATH = '{container_dataset_path}'\n\n") 
            file.write("import os\n\n")
            file.write(code) 

        print(f"Directory contents before running container: {os.listdir(submission_dir)}")
        
        client = docker.from_env()

        container = client.containers.run(
            "code-execution-image", 
            command="python /app/script.py",
            volumes={submission_dir: {'bind': '/app', 'mode': 'rw'}},
            environment={"DATASET_PATH": dataset_path},
            detach=True,  
            mem_limit="512m",  
            cpu_quota=100000,  
            network_mode="none",  
            security_opt=["no-new-privileges"], 
        )

        result = container.wait()
        logs = container.logs().decode()

        if result['StatusCode'] != 0:
            error_message = f"Error in user code: {logs}"
            logging.error(error_message)
            shutil.rmtree(submission_dir)
            return jsonify({"error": error_message, "logs": logs, "submission_id": submission_id, "userId": userId}), 400

        output = logs
        shutil.rmtree(submission_dir)

        return jsonify({"output": output, "submission_id": submission_id, "userId": userId}), 200

    except Exception as e:
        logging.error(f"Error during execution: {str(e)}")
        return jsonify({"error": str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
