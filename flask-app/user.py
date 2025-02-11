import os
import shutil
import uuid
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Lock
import docker
import matplotlib.pyplot as plt
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)

# Lock to prevent race conditions
submission_lock = Lock()

# Validate file type
allowed_extensions = {'csv', 'json'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

# Function to create a plot
def create_plot(data, plot_filename):
    plt.figure(figsize=(10, 6))
    plt.plot(data, label="Output Data", color='b')
    plt.title("Output Plot")
    plt.xlabel("Index")
    plt.ylabel("Value")
    plt.legend()

    # Save the plot as an image
    plt.savefig(plot_filename)
    plt.close()

# Function to save plot to a response-friendly format (base64 or image)
def plot_to_image(plot_filename):
    # Open the image file
    img = Image.open(plot_filename)
    # Convert the image to byte format to send in a response
    byte_io = io.BytesIO()
    img.save(byte_io, 'PNG')
    byte_io.seek(0)
    return byte_io

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
    submission_dir = os.path.join(os.path.abspath('/app/submissions'), submission_id)  # Use absolute path for submission_dir

    try:
        # Create a temporary directory for the user submission
        os.makedirs(submission_dir)
        dataset_path = os.path.join(submission_dir, dataset)
        shutil.copy(file_path, dataset_path)

        script_path = os.path.join(submission_dir, 'script.py')
        with open(script_path, "w", encoding="utf-8") as file:
            container_dataset_path = f"/app/{dataset}"  # Path inside the container
            file.write(f"DATASET_PATH = '{container_dataset_path}'\n\n") 
            file.write("import os\n\n")
            file.write(code) 

        print(f"Directory contents before running container: {os.listdir(submission_dir)}")
        
        client = docker.from_env()

        container = client.containers.run(
            "code-execution-image", 
            command="python /app/script.py",  # Use the correct command to execute the code
            volumes={  # Correct volume binding
                submission_dir: {'bind': '/app', 'mode': 'rw'},  # Correct volume for submission directory
            },
            environment={"DATASET_PATH": dataset_path},
            detach=True,  
            mem_limit="512m",  # Limit memory usage
            cpu_quota=100000,  # Limit CPU usage
            network_mode="none",  # Disable networking
            security_opt=["no-new-privileges"], 
        )

        # Wait for the container to finish and get the output
        result = container.wait()
        logs = container.logs().decode()  # Decode logs to string

        if result['StatusCode'] != 0:
            error_message = f"Error in user code: {logs}"
            logging.error(error_message)
            shutil.rmtree(submission_dir)
            return jsonify({"error": error_message, "logs": logs, "submission_id": submission_id, "userId": userId}), 400

        output = logs

        # Assuming the output is a list of numbers or data points that you want to plot
        output_data = [float(line) for line in output.splitlines() if line.strip().isdigit()]

        if output_data:
            # Generate plot
            plot_filename = os.path.join(submission_dir, "output_plot.png")
            create_plot(output_data, plot_filename)

            # Convert plot to image format for response
            plot_image = plot_to_image(plot_filename)

            # Send plot image along with output data
            shutil.rmtree(submission_dir)
            return jsonify({"output": output, "plot": plot_image.getvalue(), "submission_id": submission_id, "userId": userId}), 200

        shutil.rmtree(submission_dir)

        return jsonify({"output": output, "submission_id": submission_id, "userId": userId}), 200

    except Exception as e:
        logging.error(f"Error during execution: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

