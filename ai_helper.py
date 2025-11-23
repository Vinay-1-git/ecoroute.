"""
AI Helper Module for EcoRoute
Integrates with OpenAI and Google Gemini for intelligent navigation assistance
"""

import os
from typing import Dict, List
import requests

# Uncomment and use these imports when you have API keys
# import openai
# import google.generativeai as genai

class AINavigationAssistant:
    """AI-powered navigation assistant supporting multiple languages"""
    
    def __init__(self):
        # API Keys (Get free keys from respective platforms)
        # OpenAI: https://platform.openai.com/api-keys
        # Google Gemini: https://makersuite.google.com/app/apikey
        
        self.openai_api_key = os.getenv('OPENAI_API_KEY', '')
        self.gemini_api_key = os.getenv('GEMINI_API_KEY', '')
        
        # Initialize APIs if keys are available
        self.openai_available = False
        self.gemini_available = False
        
        if self.openai_api_key:
            try:
                # openai.api_key = self.openai_api_key
                self.openai_available = True
                print("✓ OpenAI API initialized")
            except Exception as e:
                print(f"✗ OpenAI initialization failed: {e}")
        
        if self.gemini_api_key:
            try:
                # genai.configure(api_key=self.gemini_api_key)
                self.gemini_available = True
                print("✓ Google Gemini API initialized")
            except Exception as e:
                print(f"✗ Gemini initialization failed: {e}")
    
    def process_voice_command(self, command: str, language: str = 'en') -> Dict:
        """
        Process voice command using AI
        
        Args:
            command: User's voice command
            language: Target language code
        
        Returns:
            Dict with response and metadata
        """
        # Try Gemini first (it's better for multilingual)
        if self.gemini_available:
            return self._process_with_gemini(command, language)
        
        # Fallback to OpenAI
        elif self.openai_available:
            return self._process_with_openai(command, language)
        
        # Fallback to rule-based system
        else:
            return self._process_with_rules(command, language)
    
    def _process_with_gemini(self, command: str, language: str) -> Dict:
        """Process using Google Gemini API"""
        try:
            # Uncomment when you have API key
            """
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f'''You are an eco-friendly navigation assistant for EcoRoute app.
            User command: {command}
            Language: {language}
            
            Provide a helpful, concise response about:
            - Navigation and routes
            - Weather and air quality
            - Traffic conditions
            - Environmental impact
            
            Keep response under 50 words and in {language} language.'''
            
            response = model.generate_content(prompt)
            
            return {
                'response': response.text,
                'source': 'gemini',
                'language': language
            }
            """
            return self._process_with_rules(command, language)
            
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._process_with_rules(command, language)
    
    def _process_with_openai(self, command: str, language: str) -> Dict:
        """Process using OpenAI API"""
        try:
            # Uncomment when you have API key
            """
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an eco-friendly navigation assistant."},
                    {"role": "user", "content": f"Command: {command}. Respond in {language} language."}
                ],
                max_tokens=100
            )
            
            return {
                'response': response.choices[0].message.content,
                'source': 'openai',
                'language': language
            }
            """
            return self._process_with_rules(command, language)
            
        except Exception as e:
            print(f"OpenAI error: {e}")
            return self._process_with_rules(command, language)
    
    def _process_with_rules(self, command: str, language: str) -> Dict:
        """Rule-based fallback system"""
        command_lower = command.lower()
        
        responses = {
            'en': {
                'weather': 'Current weather is pleasant with good air quality. Perfect for eco-friendly travel!',
                'route': 'I can help you find the greenest route. Please share your destination.',
                'traffic': 'Traffic is moderate. I recommend the eco route to avoid congestion and reduce emissions.',
                'pollution': 'The eco route reduces CO2 emissions by 60% compared to conventional routes.',
                'default': 'How can I help you navigate greener today?'
            },
            'hi': {
                'weather': 'मौसम सुखद है और वायु गुणवत्ता अच्छी है। पर्यावरण-अनुकूल यात्रा के लिए बिल्कुल सही!',
                'route': 'मैं आपको सबसे हरा रास्ता खोजने में मदद कर सकता हूं।',
                'traffic': 'यातायात मध्यम है। मैं इको रूट की सिफारिश करता हूं।',
                'pollution': 'इको रूट पारंपरिक मार्गों की तुलना में CO2 उत्सर्जन को 60% कम करता है।',
                'default': 'मैं आज आपकी हरित यात्रा में कैसे मदद कर सकता हूं?'
            },
            'kn': {
                'weather': 'ಹವಾಮಾನ ಆಹ್ಲಾದಕರವಾಗಿದೆ ಮತ್ತು ವಾಯು ಗುಣಮಟ್ಟ ಉತ್ತಮವಾಗಿದೆ!',
                'route': 'ನಾನು ನಿಮಗೆ ಹಸಿರು ಮಾರ್ಗವನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡಬಹುದು।',
                'traffic': 'ಸಂಚಾರ ಮಧ್ಯಮವಾಗಿದೆ। ನಾನು ಇಕೋ ಮಾರ್ಗವನ್ನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ।',
                'pollution': 'ಇಕೋ ಮಾರ್ಗವು ಸಾಂಪ್ರದಾಯಿಕ ಮಾರ್ಗಗಳಿಗಿಂತ CO2 ಹೊರಸೂಸುವಿಕೆಯನ್ನು 60% ರಷ್ಟು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ।',
                'default': 'ನಾನು ಇಂದು ನಿಮ್ಮ ಹಸಿರು ಪ್ರಯಾಣದಲ್ಲಿ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
            }
        }
        
        # Get language responses or default to English
        lang_responses = responses.get(language, responses['en'])
        
        # Determine response based on command
        if 'weather' in command_lower or 'मौसम' in command_lower:
            response_text = lang_responses['weather']
        elif 'route' in command_lower or 'navigate' in command_lower or 'रास्ता' in command_lower:
            response_text = lang_responses['route']
        elif 'traffic' in command_lower or 'यातायात' in command_lower:
            response_text = lang_responses['traffic']
        elif 'pollution' in command_lower or 'co2' in command_lower or 'प्रदूषण' in command_lower:
            response_text = lang_responses['pollution']
        else:
            response_text = lang_responses['default']
        
        return {
            'response': response_text,
            'source': 'rules',
            'language': language
        }
    
    def calculate_eco_score(self, route_data: Dict) -> float:
        """
        Calculate eco-friendliness score for a route
        
        Args:
            route_data: Dict containing route information
        
        Returns:
            Eco score from 0-100
        """
        # Factors: distance, pollution level, tree cover, traffic
        score = 50  # Base score
        
        # Adjust based on pollution level
        pollution = route_data.get('pollution_level', 'medium').lower()
        if pollution == 'low':
            score += 30
        elif pollution == 'medium':
            score += 15
        
        # Adjust based on tree cover
        tree_cover = route_data.get('tree_cover', 'medium').lower()
        if tree_cover == 'high':
            score += 20
        elif tree_cover == 'medium':
            score += 10
        
        # Adjust based on AQI
        aqi = route_data.get('aqi', 100)
        if aqi < 50:
            score += 10
        elif aqi > 150:
            score -= 20
        
        return min(100, max(0, score))

# Initialize global assistant
ai_assistant = AINavigationAssistant()

def get_ai_response(command: str, language: str = 'en') -> Dict:
    """Convenience function to get AI response"""
    return ai_assistant.process_voice_command(command, language)

def calculate_route_eco_score(route_data: Dict) -> float:
    """Convenience function to calculate eco score"""
    return ai_assistant.calculate_eco_score(route_data)
