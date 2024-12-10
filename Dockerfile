# Stage 1: Build the frontend
FROM node:18 AS frontend-build

WORKDIR /app

# Install dependencies for the frontend
COPY client/package.json client/package-lock.json ./
RUN npm install

# Build the Vite app
COPY client ./
RUN npm run build

# Stage 2: Backend API
FROM node:18 AS backend

WORKDIR /api

# Install dependencies for the backend
COPY api/package.json api/package-lock.json ./
RUN npm install

# Copy the backend code
COPY api ./

# Expose port for the backend
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]

# Stage 3: Flask app (for code execution)
FROM python:3.9-slim AS flaskapp

WORKDIR /flaskapp

# Install Python dependencies
COPY flask-app/requirements.txt ./
RUN pip install -r requirements.txt

# Copy Flask app code
COPY flask-app ./

# Expose the port for Flask
EXPOSE 5000

# Start Flask app
CMD ["python", "app.py"]
