# Stage 1: Frontend (React build)
FROM node:18 AS frontend
WORKDIR /client

# Install dependencies and build the frontend
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build


FROM python:3.9-slim AS backend
WORKDIR /api

# Copy Python dependencies
COPY api/requirements.txt /api/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY api/ /api/

# Stage 3: Final Image (Combine Frontend and Backend)
FROM python:3.9-slim
WORKDIR /api

# Copy frontend build from the first stage
COPY --from=frontend /client/build /client/build

# Copy backend from the second stage
COPY --from=backend /api /api

# Expose Flask port and run the app
EXPOSE 5000
CMD ["python", "flask-app/app.py"]
