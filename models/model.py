"""
Model handling module for MNIST digit classifier
"""

import numpy as np
import pickle
from PIL import Image
import io
import os
from config import MODEL_PATH

class MNISTModel:
    def __init__(self):
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load the pre-trained model from pickle file"""
        try:
            with open(MODEL_PATH, "rb") as f:
                self.model = pickle.load(f)
            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
    
    def preprocess_image(self, image_data):
        """Preprocess the image for model prediction"""
        # Open image from bytes
        image = Image.open(io.BytesIO(image_data)).convert('L')
        
        # Resize to 28x28
        image = image.resize((28, 28))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Check if we need to invert (if background is lighter than foreground)
        # For MNIST, digits are white on black background
        mean_val = np.mean(img_array)
        if mean_val > 127:
            img_array = 255 - img_array
        
        # Normalize to 0-1
        img_array = img_array / 255.0
        
        # Add batch and channel dimensions
        img_array = img_array.reshape(1, 28, 28, 1)
        
        return img_array
    
    def predict(self, image_data):
        """Make a prediction on the input image"""
        if self.model is None:
            return {"error": "Model not loaded"}, 500
        
        try:
            # Preprocess the image
            processed_image = self.preprocess_image(image_data)
            
            # Get prediction
            predictions = self.model.predict(processed_image)
            
            # Extract results
            probabilities = predictions[0]
            digit = int(np.argmax(probabilities))
            confidence = float(np.max(probabilities))
            
            return {
                "digit": digit,
                "confidence": confidence
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500

# Create a singleton instance
mnist_model = MNISTModel()