FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /app/data/test.txt

# Copy the remaining files to the container
COPY . .

# Set the entry point command
CMD ["python", "receiver.py", ">", "/app/data/logs_from_queue.log"]
