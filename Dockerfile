# Build Backend (Flask app)
FROM python:3.9-slim AS backend

WORKDIR /app/api

# Copy the backend code
COPY api/ /app/api

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Flask port
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "app.py"]

# Build Frontend (React app)
FROM node:16-alpine AS frontend

WORKDIR /app/client

# Copy the frontend code
COPY client/ /app/client

# Install Node.js dependencies and build the React app
RUN npm install && npm run build

# Combine Backend and Frontend
FROM python:3.9-slim AS final

WORKDIR /app

# Copy backend and frontend build
COPY --from=backend /app/api /app/api
COPY --from=frontend /app/client/build /app/api/static

# Install Python dependencies again in the final stage
RUN pip install --no-cache-dir -r api/requirements.txt

# Expose Flask port
EXPOSE 5000

# Command to run the Flask app with the built frontend
CMD ["python", "flask-app/app.py"]
