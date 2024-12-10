# Stage 1: Build the React frontend
FROM node:18 AS frontend
WORKDIR /client
COPY client/package*.json ./  
RUN npm install  
COPY client/ ./ 
RUN npm run build 


# Stage 3: Set up the Flask app and combine frontend and backend
FROM python:3.9-slim  
WORKDIR /flask-app

# Install Flask app dependencies
COPY flask-app/requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt 

# Copy Flask app code
COPY flask-app/ ./ 

# Copy the React build from Stage 1 (frontend)
COPY --from=frontend /client/dist /flask-app/client/dist  

EXPOSE 5000

# Set the Flask app entry point (correct path to app.py)
CMD ["python", "app.py"]  # Corrected the path to app.py
