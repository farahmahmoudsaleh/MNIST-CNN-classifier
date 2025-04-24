"""
Controller for digit classifier functionality
"""

from flask import Blueprint, render_template, request, jsonify
import base64
from models.model import mnist_model

# Create blueprint
digit_classifier_bp = Blueprint('digit_classifier', __name__)

@digit_classifier_bp.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@digit_classifier_bp.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests"""
    if not request.json or 'image' not in request.json:
        return jsonify({"error": "No image provided"}), 400
    
    try:
        # Get base64 encoded image from request
        image_data = base64.b64decode(request.json['image'])
        
        # Use the model to make a prediction
        result, status_code = mnist_model.predict(image_data)
        
        return jsonify(result), status_code
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500