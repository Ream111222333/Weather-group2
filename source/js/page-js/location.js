// Global map variable
let map;
let marker;
let searchHistory = [];

document.addEventListener('DOMContentLoaded', function () {
    initializeMap();
    setupSearchFunctionality();
    setupZoomControls();
});

// Initialize Leaflet Map
function initializeMap() {
    // Default center (Cambodia)
    const defaultLat = 11.5564;
    const defaultLng = 104.9282;

    // Create map centered on Cambodia
    map = L.map('map').setView([defaultLat, defaultLng], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add initial marker
    marker = L.marker([defaultLat, defaultLng]).addTo(map)
        .bindPopup('Cambodia - Weather Location');

    console.log('Map initialized successfully');
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.location-search input');

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchQuery = searchInput.value.trim();
                if (searchQuery) {
                    searchLocation(searchQuery);
                }
            }
        });

        // Real-time search with debounce
        let debounceTimer;
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const searchQuery = searchInput.value.trim();
                if (searchQuery.length > 1) {
                    searchLocation(searchQuery);
                }
            }, 400);
        });
    } else {
        console.warn('Search input not found');
    }
}

// Search for a location using Nominatim (OpenStreetMap's geocoding service)
function searchLocation(query) {
    console.log('Searching for: ' + query);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Use the first result
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                const name = result.display_name;

                // Update map to new location
                map.setView([lat, lng], 10);

                // Update or create marker
                if (marker) {
                    map.removeLayer(marker);
                }
                marker = L.marker([lat, lng]).addTo(map)
                    .bindPopup(`<b>${result.name || name}</b><br>${result.type}`)
                    .openPopup();

                // Fetch weather data for this location
                fetchWeatherData(lat, lng, result.name || name);

                // Show all results
                showSearchResults(data);

                // Show notification
                showNotification(`Found: ${result.name || name}`);

                // Add to search history
                searchHistory.push({ name: result.name || name, lat: lat, lng: lng });
            } else {
                showNotification('Location not found. Try another search.');
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            showNotification('Error searching location. Please try again.');
        });
}


// Display search results
function showSearchResults(results) {
    const resultDiv = document.getElementById('search-results');
    const resultsList = document.getElementById('results-list');

    if (!resultDiv || !resultsList) return;

    resultsList.innerHTML = '';

    results.slice(0, 5).forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.style.cssText = `
            padding: 10px;
            margin: 5px 0;
            background: white;
            border-left: 4px solid #2196F3;
            cursor: pointer;
            border-radius: 5px;
        `;
        resultItem.innerHTML = `
            <strong>${index + 1}. ${result.name || result.display_name.split(',')[0]}</strong><br>
            <small>${result.type} - ${result.display_name.split(',')[1] || ''}</small>
        `;

        resultItem.addEventListener('click', () => {
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            map.setView([lat, lng], 10);

            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${result.name}</b><br>${result.type}`)
                .openPopup();

            // Fetch weather for clicked location
            fetchWeatherData(lat, lng, result.name || result.display_name);
            showNotification(`Selected: ${result.name}`);
        });

        resultsList.appendChild(resultItem);
    });

    resultDiv.style.display = 'block';
}

// Fetch weather data using Open-Meteo API (free, no API key needed)
function fetchWeatherData(lat, lng, locationName) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&temperature_unit=celsius&wind_speed_unit=kmh`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.current) {
                displayWeatherInfo(data.current, locationName);
            }
        })
        .catch(error => {
            console.error('Weather fetch error:', error);
            showNotification('Could not fetch weather data');
        });
}

// Display weather information
function displayWeatherInfo(weatherData, locationName) {
    const weatherSection = document.getElementById('weather-section');
    const weatherLocation = document.getElementById('weather-location');
    const weatherType = document.getElementById('weather-type');
    const weatherTemp = document.getElementById('weather-temperature');
    const weatherHumidity = document.getElementById('weather-humidity');
    const weatherWind = document.getElementById('weather-wind');
    const weatherPressure = document.getElementById('weather-pressure');
    const weatherFeels = document.getElementById('weather-feels');

    // Get weather description from weather code
    const weatherDescription = getWeatherDescription(weatherData.weather_code);

    // Update weather display
    weatherLocation.textContent = locationName.split(',')[0];
    weatherType.textContent = weatherDescription;
    weatherTemp.textContent = Math.round(weatherData.temperature_2m);
    weatherHumidity.textContent = weatherData.relative_humidity_2m + '%';
    weatherWind.textContent = weatherData.wind_speed_10m + ' km/h';
    weatherPressure.textContent = Math.round(weatherData.pressure_msl) + ' hPa';
    weatherFeels.textContent = 'Feels like: ' + Math.round(weatherData.apparent_temperature) + '°C';

    // Show weather section
    weatherSection.style.display = 'block';

    // Scroll to weather section
    setTimeout(() => {
        weatherSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}


// Get weather description from WMO weather code
function getWeatherDescription(code) {
    const weatherCodes = {
        0: '☀️ Clear Sky',
        1: '🌤 Mainly Clear',
        2: '⛅️ Partly Cloudy',
        3: '☁️ Overcast',
        45: '🌫 Foggy',
        48: '🌫 Depositing Rime Fog',
        51: '🌧 Light Drizzle',
        53: '🌧 Moderate Drizzle',
        55: '🌧 Dense Drizzle',
        61: '🌧 Slight Rain',
        63: '🌧 Moderate Rain',
        65: '🌧 Heavy Rain',
        71: '🌨 Slight Snow',
        73: '🌨 Moderate Snow',
        75: '🌨 Heavy Snow',
        77: '🌨 Snow Grains',
        80: '🌧 Slight Rain Showers',
        81: '🌧 Moderate Rain Showers',
        82: '🌧 Violent Rain Showers',
        85: '🌨 Slight Snow Showers',
        86: '🌨 Heavy Snow Showers',
        95: '⛈ Thunderstorm',
        96: '⛈ Thunderstorm with Slight Hail',
        99: '⛈ Thunderstorm with Heavy Hail'
    };

    return weatherCodes[code] || 'Unknown Weather';
}

// Setup zoom controls
function setupZoomControls() {
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            map.zoomIn();
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            map.zoomOut();
        });
    }
}

// Show notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2196F3;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-in;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
