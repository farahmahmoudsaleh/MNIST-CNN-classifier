from flask import Flask
import os
from controllers.digit_classifier import digit_classifier_bp

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(digit_classifier_bp)
    
    # Ensure necessary directories exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8080, debug=True)