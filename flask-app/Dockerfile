# Use an official Python runtime as a parent image
FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir --timeout=6000 -r requirements.txt

RUN pip show numpy

RUN pip show pandas

RUN pip install docker

EXPOSE 5000

ENV NAME=World

CMD ["python", "app.py"]