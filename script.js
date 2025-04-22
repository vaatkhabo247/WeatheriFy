document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const weatherCard = document.querySelector('.weather-card');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const themeToggle = document.getElementById('toggle-theme');
    
    // Weather elements
    const cityElement = document.getElementById('city');
    const countryElement = document.getElementById('country');
    const dateElement = document.getElementById('date');
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');
    const feelsLikeElement = document.getElementById('feels-like');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');
    const pressureElement = document.getElementById('pressure');
    const precipElement = document.getElementById('precip');
    const weatherIcon = document.getElementById('weather-icon');
    const background = document.querySelector('.background');
    
    // API Key and base URL
    const API_KEY = '661f355e880d4ba9a24121001252204';
    const BASE_URL = 'http://api.weatherapi.com/v1/current.json';
    
    // Initialize app
    init();
    
    function init() {
        // Set current date
        updateDate();
        
        // Event listeners
        searchBtn.addEventListener('click', searchWeather);
        locationBtn.addEventListener('click', getLocationWeather);
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchWeather();
        });
        
        themeToggle.addEventListener('change', toggleTheme);
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
        
        // Try to get weather for user's location by default
        getLocationWeather();
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    }
    
    function updateDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
    
    function searchWeather() {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeather(location);
        } else {
            alert('Please enter a location');
        }
    }
    
    function getLocationWeather() {
        if (navigator.geolocation) {
            showLoading(true);
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(`${latitude},${longitude}`);
                },
                error => {
                    showLoading(false);
                    console.error('Geolocation error:', error);
                    alert('Unable to retrieve your location. Please enter a location manually.');
                    // Default to London if geolocation fails
                    fetchWeather('London');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please enter a location manually.');
            fetchWeather('London');
        }
    }
    
    async function fetchWeather(location) {
        showLoading(true);
        
        try {
            const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${location}&aqi=yes`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            updateUI(data);
            updateBackground(data.current.condition.text);
        } catch (error) {
            console.error('Error fetching weather:', error);
            alert('Error fetching weather data. Please try again.');
        } finally {
            showLoading(false);
        }
    }
    
    function updateUI(data) {
        const { location, current } = data;
        
        // Update location info
        cityElement.textContent = location.name;
        countryElement.textContent = `${location.region ? `${location.region}, ` : ''}${location.country}`;
        
        // Update weather info
        tempElement.textContent = Math.round(current.temp_c);
        conditionElement.textContent = current.condition.text;
        feelsLikeElement.textContent = Math.round(current.feelslike_c);
        humidityElement.textContent = current.humidity;
        windElement.textContent = Math.round(current.wind_kph);
        pressureElement.textContent = current.pressure_mb;
        precipElement.textContent = current.precip_mm;
        
        // Update weather icon
        updateWeatherIcon(current.condition.code, current.is_day);
        
        // Update input field
        locationInput.value = location.name;
        
        // Add fade-in effect
        weatherCard.classList.add('fade-in');
        setTimeout(() => weatherCard.classList.remove('fade-in'), 500);
    }
    
    function updateWeatherIcon(code, isDay) {
        // Weather code mapping to weather-icons classes
        const iconMap = {
            1000: isDay ? 'wi-day-sunny' : 'wi-night-clear',
            1003: isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy',
            1006: 'wi-cloudy',
            1009: 'wi-cloudy',
            1030: 'wi-fog',
            1063: isDay ? 'wi-day-rain' : 'wi-night-alt-rain',
            1066: isDay ? 'wi-day-snow' : 'wi-night-alt-snow',
            1069: 'wi-sleet',
            1072: 'wi-sleet',
            1087: 'wi-thunderstorm',
            1114: 'wi-snow-wind',
            1117: 'wi-snow-wind',
            1135: 'wi-fog',
            1147: 'wi-fog',
            1150: 'wi-sprinkle',
            1153: 'wi-sprinkle',
            1168: 'wi-sleet',
            1171: 'wi-sleet',
            1180: isDay ? 'wi-day-rain' : 'wi-night-alt-rain',
            1183: 'wi-sprinkle',
            1186: isDay ? 'wi-day-rain' : 'wi-night-alt-rain',
            1189: 'wi-rain',
            1192: 'wi-rain',
            1195: 'wi-rain',
            1198: 'wi-sleet',
            1201: 'wi-sleet',
            1204: 'wi-sleet',
            1207: 'wi-sleet',
            1210: isDay ? 'wi-day-snow' : 'wi-night-alt-snow',
            1213: 'wi-snow',
            1216: 'wi-snow',
            1219: 'wi-snow',
            1222: 'wi-snow',
            1225: 'wi-snow',
            1237: 'wi-hail',
            1240: isDay ? 'wi-day-showers' : 'wi-night-alt-showers',
            1243: 'wi-showers',
            1246: 'wi-rain-wind',
            1249: 'wi-sleet',
            1252: 'wi-sleet',
            1255: 'wi-snow',
            1258: 'wi-snow',
            1261: 'wi-hail',
            1264: 'wi-hail',
            1273: isDay ? 'wi-day-thunderstorm' : 'wi-night-alt-thunderstorm',
            1276: 'wi-thunderstorm',
            1279: isDay ? 'wi-day-snow-thunderstorm' : 'wi-night-alt-snow-thunderstorm',
            1282: 'wi-snow-wind'
        };
        
        const iconClass = iconMap[code] || 'wi-day-sunny';
        weatherIcon.className = `wi ${iconClass}`;
    }
    
    function updateBackground(condition) {
        let query;
        
        // Map weather conditions to appropriate background images
        if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) {
            query = 'sunny';
        } else if (condition.toLowerCase().includes('cloud')) {
            query = 'cloudy';
        } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
            query = 'rainy';
        } else if (condition.toLowerCase().includes('snow') || condition.toLowerCase().includes('sleet') || condition.toLowerCase().includes('ice')) {
            query = 'snow';
        } else if (condition.toLowerCase().includes('thunder') || condition.toLowerCase().includes('storm')) {
            query = 'storm';
        } else if (condition.toLowerCase().includes('fog') || condition.toLowerCase().includes('mist') || condition.toLowerCase().includes('haze')) {
            query = 'fog';
        } else {
            query = 'weather';
        }
        
        background.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${query}')`;
    }
    
    function showLoading(show) {
        if (show) {
            loadingSpinner.classList.add('active');
        } else {
            loadingSpinner.classList.remove('active');
        }
    }
});