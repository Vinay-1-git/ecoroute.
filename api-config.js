/**
 * API Configuration for EcoRoute Frontend
 * This file handles all backend API communications
 */

// ⭐ Backend URL Configuration
const API_CONFIG = {
    // Local development
    BASE_URL: 'http://localhost:5000',
    
    // Use this for production (replace with your deployed backend URL)
    // BASE_URL: 'https://your-backend-url.herokuapp.com',
    
    ENDPOINTS: {
        TEST: '/api/test',
        SIGNUP: '/api/signup',
        LOGIN: '/api/login',
        WEATHER: '/api/weather',
        AIR_QUALITY: '/api/air-quality',
        CALCULATE_ROUTE: '/api/calculate-route',
        TRAFFIC: '/api/traffic',
        VOICE_ASSISTANT: '/api/voice-assistant',
        FEEDBACK: '/api/feedback',
        TRANSLATE: '/api/translate'
    }
};

// ⭐ API Helper Functions
const API = {
    /**
     * Test backend connection
     */
    async testConnection() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST}`);
            const data = await response.json();
            console.log('✓ Backend connected:', data);
            return data;
        } catch (error) {
            console.error('✗ Backend connection failed:', error);
            return null;
        }
    },

    /**
     * User Signup
     */
    async signup(userData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * User Login
     */
    async login(credentials) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get Weather Data
     */
    async getWeather(lat = '28.6139', lon = '77.2090') {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Weather error:', error);
            // Return mock data if backend fails
            return {
                success: true,
                data: {
                    temperature: '28°C',
                    condition: 'Partly Cloudy',
                    humidity: 65
                }
            };
        }
    },

    /**
     * Calculate Routes
     */
    async calculateRoute(origin, destination) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CALCULATE_ROUTE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ origin, destination })
            });
            
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Route calculation error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get Traffic Data
     */
    async getTraffic() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRAFFIC}`);
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Traffic error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Voice Assistant
     */
    async processVoiceCommand(command, language = 'en') {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VOICE_ASSISTANT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command, language })
            });
            
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Voice assistant error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Submit Feedback
     */
    async submitFeedback(feedbackData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEEDBACK}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });
            
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Feedback error:', error);
            return { success: false, error: error.message };
        }
    }
};

// ⭐ Connection Status Indicator
async function checkBackendStatus() {
    const result = await API.testConnection();
    
    if (result) {
        console.log('✅ Backend Status: CONNECTED');
        return true;
    } else {
        console.log('❌ Backend Status: DISCONNECTED');
        console.log('💡 Make sure backend is running on http://localhost:5000');
        return false;
    }
}

// Test connection when page loads
window.addEventListener('DOMContentLoaded', () => {
    checkBackendStatus();
});
