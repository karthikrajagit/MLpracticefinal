# Stage 1: Build the React frontend
FROM node:18 AS frontend
WORKDIR /client
COPY client/package*.json ./  
RUN npm install  
COPY client/ ./ 
RUN npm run build 
# Stage 2: Set up the Flask backend
FROM python:3.9-slim AS backend
WORKDIR /api  
COPY api/ ./  

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

# Copy the API code from Stage 2 (backend)
COPY --from=backend /api /flask-app/api  
# Expose port for Flask app
EXPOSE 5000

# Set the Flask app entry point
CMD ["python", "flask-app/app.py"]  
