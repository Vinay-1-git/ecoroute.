from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)

# ⭐ IMPORTANT: Enable CORS for all routes
# This allows frontend to connect from different port/domain
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # Allow all origins in development
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

# Test endpoint to verify connection
@app.route('/api/test', methods=['GET'])
def test_connection():
    """Test if frontend can connect to backend"""
    return jsonify({
        'status': 'success',
        'message': 'Backend is connected!',
        'timestamp': datetime.now().isoformat()
    }), 200

# User Authentication
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    return jsonify({
        'status': 'success',
        'message': 'User registered successfully',
        'data': data
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Simple validation (in production, check against database)
    if email and password:
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'user': {'email': email, 'name': 'Test User'}
        }), 200
    else:
        return jsonify({
            'status': 'error',
            'message': 'Invalid credentials'
        }), 401

# Weather endpoint
@app.route('/api/weather', methods=['GET'])
def get_weather():
    return jsonify({
        'temperature': '28°C',
        'condition': 'Partly Cloudy',
        'humidity': 65,
        'aqi': 'Good'
    }), 200

# Route calculation
@app.route('/api/calculate-route', methods=['POST'])
def calculate_route():
    data = request.json
    origin = data.get('origin')
    destination = data.get('destination')
    
    routes = [
        {
            'id': 1,
            'name': 'Eco Route',
            'distance': '12.5 km',
            'duration': '28 min',
            'pollution_level': 'Low',
            'co2_emission': '1.2 kg',
            'color': 'green'
        },
        {
            'id': 2,
            'name': 'Moderate Route',
            'distance': '10.8 km',
            'duration': '22 min',
            'pollution_level': 'Medium',
            'co2_emission': '2.5 kg',
            'color': 'yellow'
        }
    ]
    
    return jsonify({
        'status': 'success',
        'origin': origin,
        'destination': destination,
        'routes': routes
    }), 200

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🌱 ECOROUTE BACKEND SERVER")
    print("="*50)
    print("✓ Server running on: http://localhost:5000")
    print("✓ CORS enabled for all origins")
    print("✓ Test endpoint: http://localhost:5000/api/test")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
