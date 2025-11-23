// Initialize map
let map;
let currentLanguage = 'en';
let selectedRating = 0;

// Check if user is logged in
window.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
    }
    
    // Initialize map
    initMap();
    
    // Load weather data
    loadWeatherData();
    
    // Load traffic alerts
    loadTrafficAlerts();
    
    // Setup rating stars
    setupRatingStars();
});

// Initialize Leaflet Map
function initMap() {
    // Default location: New Delhi
    map = L.map('map').setView([28.6139, 77.2090], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add sample marker
    L.marker([28.6139, 77.2090]).addTo(map)
        .bindPopup('New Delhi - Your Location')
        .openPopup();
}

// Search Route Function
function searchRoute() {
    const from = document.getElementById('fromLocation').value;
    const to = document.getElementById('toLocation').value;
    
    if (!from || !to) {
        alert('Please enter both starting point and destination');
        return;
    }
    
    // Simulate route search with three options
    const routeOptions = [
        {
            name: 'Eco Route',
            distance: '12.5 km',
            time: '28 min',
            pollution: 'Low',
            co2: '1.2 kg',
            color: 'green'
        },
        {
            name: 'Moderate Route',
            distance: '10.8 km',
            time: '22 min',
            pollution: 'Medium',
            co2: '2.5 kg',
            color: 'yellow'
        },
        {
            name: 'Fast Route',
            distance: '9.2 km',
            time: '18 min',
            pollution: 'High',
            co2: '4.8 kg',
            color: 'red'
        }
    ];
    
    const routeOptionsDiv = document.getElementById('routeOptions');
    routeOptionsDiv.innerHTML = '<h3>Available Routes:</h3>';
    
    routeOptions.forEach((route, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = `route-option ${route.color}`;
        optionDiv.innerHTML = `
            <strong>${route.name}</strong><br>
            Distance: ${route.distance} | Time: ${route.time}<br>
            Pollution: ${route.pollution} | CO2: ${route.co2}
        `;
        optionDiv.onclick = () => selectRoute(route, index);
        routeOptionsDiv.appendChild(optionDiv);
    });
    
    // Draw sample routes on map
    drawSampleRoutes();
}

// Draw sample routes on map
function drawSampleRoutes() {
    // Clear existing layers except base map
    map.eachLayer(function(layer) {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    // Sample coordinates for routes
    const routes = [
        {
            coords: [[28.6139, 77.2090], [28.6200, 77.2200], [28.6300, 77.2400]],
            color: '#22c55e',
            weight: 6
        },
        {
            coords: [[28.6139, 77.2090], [28.6250, 77.2150], [28.6300, 77.2400]],
            color: '#fbbf24',
            weight: 4
        },
        {
            coords: [[28.6139, 77.2090], [28.6180, 77.2250], [28.6300, 77.2400]],
            color: '#ef4444',
            weight: 4
        }
    ];
    
    routes.forEach(route => {
        L.polyline(route.coords, {
            color: route.color,
            weight: route.weight,
            opacity: 0.7
        }).addTo(map);
    });
    
    // Add markers
    L.marker([28.6139, 77.2090]).addTo(map).bindPopup('Start');
    L.marker([28.6300, 77.2400]).addTo(map).bindPopup('Destination');
}

// Select Route
function selectRoute(route, index) {
    alert(`Selected: ${route.name}\nDistance: ${route.distance}\nEstimated CO2: ${route.co2}`);
    
    // Update dashboard stats
    updateDashboardStats(route);
    
    // Start navigation with voice
    speakNavigation(`Route selected. ${route.name}. Distance ${route.distance}. Estimated time ${route.time}.`);
}

// Update Dashboard Stats
function updateDashboardStats(route) {
    document.getElementById('co2Level').textContent = route.co2;
    document.getElementById('vehicleDensity').textContent = route.pollution;
}

// Load Weather Data (simulated)
async function loadWeatherData() {
    // In production, use OpenWeatherMap API
    const weatherData = {
        temp: '28°C',
        condition: 'Partly Cloudy',
        aqi: 'Good'
    };
    
    document.getElementById('weatherData').textContent = 
        `${weatherData.temp}, ${weatherData.condition}, AQI: ${weatherData.aqi}`;
}

// Load Traffic Alerts
function loadTrafficAlerts() {
    const alerts = [
        { location: 'Connaught Place', level: 'high', message: 'Heavy traffic - delays expected' },
        { location: 'India Gate', level: 'medium', message: 'Moderate traffic' }
    ];
    
    const alertsDiv = document.getElementById('trafficAlerts');
    alertsDiv.innerHTML = '';
    
    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `traffic-alert ${alert.level}`;
        alertDiv.innerHTML = `<strong>${alert.location}:</strong> ${alert.message}`;
        alertsDiv.appendChild(alertDiv);
    });
}

// Voice Assistant Functions
let recognition;
let isListening = false;

function toggleVoiceAssistant() {
    const modal = document.getElementById('voiceModal');
    modal.classList.toggle('active');
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = getLanguageCode(currentLanguage);
    recognition.continuous = false;
    
    const micBtn = document.getElementById('micBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    const voiceTranscript = document.getElementById('voiceTranscript');
    
    if (!isListening) {
        recognition.start();
        isListening = true;
        micBtn.classList.add('active');
        voiceStatus.textContent = 'Listening...';
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            voiceTranscript.textContent = `You said: "${transcript}"`;
            processVoiceCommand(transcript);
        };
        
        recognition.onend = () => {
            isListening = false;
            micBtn.classList.remove('active');
            voiceStatus.textContent = 'Click microphone to speak';
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            voiceStatus.textContent = 'Error occurred. Please try again.';
            isListening = false;
            micBtn.classList.remove('active');
        };
    } else {
        recognition.stop();
        isListening = false;
        micBtn.classList.remove('active');
    }
}

// Process Voice Commands
function processVoiceCommand(command) {
    const lowerCommand = command.toLowerCase();
    const responseDiv = document.getElementById('voiceResponse');
    
    let response = '';
    
    if (lowerCommand.includes('weather')) {
        response = 'Current weather is 28 degrees Celsius, partly cloudy with good air quality.';
    } else if (lowerCommand.includes('route') || lowerCommand.includes('navigate')) {
        response = 'Please enter your destination on the left panel to find eco-friendly routes.';
    } else if (lowerCommand.includes('traffic')) {
        response = 'Heavy traffic detected at Connaught Place. Moderate traffic at India Gate.';
    } else if (lowerCommand.includes('pollution') || lowerCommand.includes('co2')) {
        response = 'Current CO2 level is 420 parts per million. Eco route will reduce emissions by 60%.';
    } else {
        response = 'How can I assist you with navigation today?';
    }
    
    responseDiv.innerHTML = `<p><strong>Assistant:</strong> ${response}</p>`;
    speakNavigation(response);
}

// Text-to-Speech Function
function speakNavigation(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getLanguageCode(currentLanguage);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

// Change Language
function changeLanguage() {
    currentLanguage = document.getElementById('languageSelect').value;
    // Update all text elements based on language
    translateInterface(currentLanguage);
}

// Get language code for speech
function getLanguageCode(lang) {
    const langCodes = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'kn': 'kn-IN',
        'ta': 'ta-IN',
        'te': 'te-IN',
        'ml': 'ml-IN',
        'bn': 'bn-IN',
        'mr': 'mr-IN',
        'gu': 'gu-IN',
        'pa': 'pa-IN'
    };
    return langCodes[lang] || 'en-US';
}

// Translate Interface (simplified - in production use i18n library)
function translateInterface(lang) {
    // This would be connected to backend translation service
    console.log('Language changed to:', lang);
}

// Rating Stars Setup
function setupRatingStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStars();
        });
    });
}

function updateStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit Feedback
function submitFeedback() {
    const feedback = document.getElementById('feedbackText').value;
    
    if (!feedback || selectedRating === 0) {
        alert('Please provide feedback and rating');
        return;
    }
    
    // In production, send to backend
    const feedbackData = {
        user: localStorage.getItem('currentUser'),
        feedback: feedback,
        rating: selectedRating,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for demo
    const existingFeedback = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('feedbacks', JSON.stringify(existingFeedback));
    
    alert('Thank you for your feedback!');
    document.getElementById('feedbackText').value = '';
    selectedRating = 0;
    updateStars();
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}
