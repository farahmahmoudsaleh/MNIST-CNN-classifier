# MNIST-classifier
Complete ML workflow for handwritten digit recognition with MNIST dataset. Features data preprocessing, CNN model training with TensorFlow, MLflow tracking, model registry, REST API deployment, and interactive web interface for real-time predictions.

## Features

- Draw digits on a canvas for real-time classification
- Upload images of handwritten digits
- Display prediction results with confidence scores

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Machine Learning**: Pre-trained model on MNIST dataset

## Usage

1. **Draw Mode**: Draw a digit (0-9) on the canvas and click "Predict"
2. **Upload Mode**: Upload an image of a handwritten digit and click "Predict"

## Excution steps : 

docker pull farahmsaleh/mnist-classifier-web:latest

docker run -d -p 8080:8080 --name mnist_classifier farahmsaleh/mnist-classifier-web:latest

open link : http://127.0.0.1:8080/
