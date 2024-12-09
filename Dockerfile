# Frontend
FROM node:18 AS frontend
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# Backend
FROM python:3.10 AS backend
WORKDIR /api
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api ./

# Final Stage
FROM python:3.10
WORKDIR /app
COPY --from=frontend /client/build /app/client
COPY --from=backend /api /app/api
CMD ["python", "api/app.py"]
