from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import json

# AI imports (using open source alternatives)
from transformers import pipeline
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize AI models (using open source Hugging Face models)
# For production, you can use Google Gemini or OpenAI APIs
try:
    # Text generation model for navigation assistance
    text_generator = pipeline('text-generation', model='gpt2')
except Exception as e:
    print(f"AI model loading warning: {e}")
    text_generator = None

# OpenWeatherMap API (Free tier - get your key from https://openweathermap.org/api)
OPENWEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"  # Get free key from openweathermap.org

# Google Maps API (Free tier with limits)
GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"  # Get from Google Cloud Console

# Simulated database (in production, use PostgreSQL/MongoDB)
users_db = {}
feedbacks_db = []
routes_cache = {}

# User Authentication Endpoints
@app.route('/api/signup', methods=['POST'])
def signup():
    """Handle user registration"""
    data = request.json
    email = data.get('email')
    
    if email in users_db:
        return jsonify({'error': 'User already exists'}), 400
    
    users_db[email] = {
        'name': data.get('name'),
        'email': email,
        'password': data.get('password'),  # In production, hash passwords!
        'created_at': datetime.now().isoformat()
    }
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    """Handle user login"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = users_db.get(email)
    if not user or user['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    return jsonify({
        'message': 'Login successful',
        'user': {'name': user['name'], 'email': user['email']}
    }), 200

# Weather Data Endpoint
@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Fetch real-time weather data"""
    lat = request.args.get('lat', '28.6139')
    lon = request.args.get('lon', '77.2090')
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        data = response.json()
        
        return jsonify({
            'temperature': f"{data['main']['temp']}°C",
            'condition': data['weather'][0]['description'],
            'humidity': data['main']['humidity'],
            'wind_speed': data['wind']['speed']
        }), 200
    except Exception as e:
        # Return mock data if API fails
        return jsonify({
            'temperature': '28°C',
            'condition': 'Partly Cloudy',
            'humidity': 65,
            'wind_speed': 3.5
        }), 200

# Air Quality Endpoint
@app.route('/api/air-quality', methods=['GET'])
def get_air_quality():
    """Fetch air quality data"""
    lat = request.args.get('lat', '28.6139')
    lon = request.args.get('lon', '77.2090')
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
        response = requests.get(url, timeout=5)
        data = response.json()
        
        aqi = data['list'][0]['main']['aqi']
        components = data['list'][0]['components']
        
        return jsonify({
            'aqi': aqi,
            'co2': components.get('co', 0),
            'pm2_5': components.get('pm2_5', 0),
            'pm10': components.get('pm10', 0)
        }), 200
    except Exception as e:
        return jsonify({
            'aqi': 2,
            'co2': 420,
            'pm2_5': 45,
            'pm10': 60
        }), 200

# Route Calculation with Pollution Data
@app.route('/api/calculate-route', methods=['POST'])
def calculate_route():
    """Calculate eco-friendly routes with pollution data"""
    data = request.json
    origin = data.get('origin')
    destination = data.get('destination')
    
    # In production, integrate with Google Maps Directions API
    # and pollution APIs to calculate real routes
    
    routes = [
        {
            'id': 1,
            'name': 'Eco Route',
            'distance': '12.5 km',
            'duration': '28 min',
            'pollution_level': 'Low',
            'co2_emission': '1.2 kg',
            'color': 'green',
            'waypoints': [[28.6139, 77.2090], [28.6200, 77.2200], [28.6300, 77.2400]],
            'aqi': 45,
            'tree_cover': 'High'
        },
        {
            'id': 2,
            'name': 'Moderate Route',
            'distance': '10.8 km',
            'duration': '22 min',
            'pollution_level': 'Medium',
            'co2_emission': '2.5 kg',
            'color': 'yellow',
            'waypoints': [[28.6139, 77.2090], [28.6250, 77.2150], [28.6300, 77.2400]],
            'aqi': 95,
            'tree_cover': 'Medium'
        },
        {
            'id': 3,
            'name': 'Fast Route',
            'distance': '9.2 km',
            'duration': '18 min',
            'pollution_level': 'High',
            'co2_emission': '4.8 kg',
            'color': 'red',
            'waypoints': [[28.6139, 77.2090], [28.6180, 77.2250], [28.6300, 77.2400]],
            'aqi': 165,
            'tree_cover': 'Low'
        }
    ]
    
    return jsonify({'routes': routes}), 200

# Traffic Data Endpoint
@app.route('/api/traffic', methods=['GET'])
def get_traffic():
    """Get real-time traffic data"""
    # In production, integrate with traffic APIs
    traffic_data = [
        {
            'location': 'Connaught Place',
            'level': 'high',
            'message': 'Heavy traffic - 15 min delay expected',
            'coordinates': [28.6315, 77.2167]
        },
        {
            'location': 'India Gate',
            'level': 'medium',
            'message': 'Moderate traffic',
            'coordinates': [28.6129, 77.2295]
        },
        {
            'location': 'Karol Bagh',
            'level': 'low',
            'message': 'Traffic flowing smoothly',
            'coordinates': [28.6519, 77.1910]
        }
    ]
    
    return jsonify({'traffic': traffic_data}), 200

# AI Voice Assistant Endpoint
@app.route('/api/voice-assistant', methods=['POST'])
def voice_assistant():
    """Process voice commands using AI"""
    data = request.json
    command = data.get('command', '').lower()
    language = data.get('language', 'en')
    
    # Process command and generate response
    if 'weather' in command:
        response = "Current weather is 28 degrees Celsius, partly cloudy with good air quality index of 45."
    elif 'route' in command or 'navigate' in command:
        response = "I can help you find eco-friendly routes. Please provide your starting point and destination."
    elif 'traffic' in command:
        response = "Heavy traffic detected at Connaught Place with 15 minutes delay. Moderate traffic at India Gate. I recommend the eco route to avoid congestion."
    elif 'pollution' in command or 'co2' in command:
        response = "Current CO2 level is 420 parts per million. The eco route will reduce your carbon emissions by 60 percent compared to the fastest route."
    elif 'help' in command:
        response = "I can assist you with navigation, weather updates, traffic information, and eco-friendly route suggestions. What would you like to know?"
    else:
        # Use AI model for complex queries
        if text_generator:
            try:
                ai_response = text_generator(
                    f"Navigation assistant response to: {command}",
                    max_length=100,
                    num_return_sequences=1
                )
                response = ai_response[0]['generated_text']
            except:
                response = "How can I assist you with eco-friendly navigation today?"
        else:
            response = "How can I assist you with eco-friendly navigation today?"
    
    return jsonify({
        'response': response,
        'language': language
    }), 200

# Feedback Endpoint
@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Store user feedback"""
    data = request.json
    feedback = {
        'user': data.get('user'),
        'rating': data.get('rating'),
        'comment': data.get('comment'),
        'timestamp': datetime.now().isoformat()
    }
    
    feedbacks_db.append(feedback)
    
    return jsonify({'message': 'Feedback received successfully'}), 201

@app.route('/api/feedback', methods=['GET'])
def get_feedbacks():
    """Retrieve all feedbacks"""
    return jsonify({'feedbacks': feedbacks_db}), 200

# Translation Endpoint (using open source approach)
@app.route('/api/translate', methods=['POST'])
def translate_text():
    """Translate text to different Indian languages"""
    data = request.json
    text = data.get('text')
    target_lang = data.get('target_lang', 'en')
    
    # In production, use Google Translate API or IndicTrans
    # For now, return sample translations
    translations = {
        'hi': 'नमस्ते, मैं आपकी नेविगेशन में कैसे मदद कर सकता हूं?',
        'kn': 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮ್ಮ ನ್ಯಾವಿಗೇಶನ್‌ನಲ್ಲಿ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        'ta': 'வணக்கம், உங்கள் வழிசெலுத்தலில் நான் எவ்வாறு உதவ முடியும்?',
        'te': 'నమస్కారం, మీ నావిగేషన్‌లో నేను ఎలా సహాయం చేయగలను?',
        'en': 'Hello, how can I assist you with navigation?'
    }
    
    return jsonify({
        'translated_text': translations.get(target_lang, text)
    }), 200

# Health Check
@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    print("=" * 50)
    print("EcoRoute Backend Server Starting...")
    print("=" * 50)
    print("Server running on: http://localhost:5000")
    print("API Endpoints available:")
    print("  - POST /api/signup")
    print("  - POST /api/login")
    print("  - GET  /api/weather")
    print("  - GET  /api/air-quality")
    print("  - POST /api/calculate-route")
    print("  - GET  /api/traffic")
    print("  - POST /api/voice-assistant")
    print("  - POST /api/feedback")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
