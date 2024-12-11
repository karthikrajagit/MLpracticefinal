# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --timeout=6000 -r requirements.txt

RUN pip show numpy

RUN pip show pandas

RUN pip install docker


# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV NAME=World

# Run the application
CMD ["python", "app.py"]