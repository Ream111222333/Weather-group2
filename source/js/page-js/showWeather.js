/* ===================== CONFIG ===================== */
const apiKey = 'bd1b0d9c907f21d41c7e880436ab3832';
const countryCode = 'KH';
let unit = localStorage.getItem('unit') || 'metric';

/* ===================== CAMBODIA PROVINCES ===================== */
const cambodiaProvinces = [
    'Phnom Penh', 'Kampong Thom', 'Siem Reap', 'Battambang', 'Kampot',
    'Sihanoukville', 'Takeo', 'Prey Veng', 'Kandal', 'Svay Rieng',
    'Pursat', 'Banteay Meanchey', 'Kratie', 'Mondulkiri', 'Ratanakiri'
];

/* ===================== MAIN FETCH ===================== */
async function getWeather(cityInput) {
    const cityName = cityInput || localStorage.getItem('lastCity') || 'Phnom Penh';
    const city = `${cityName},${countryCode}`;

    toggleLoading(true);

    try {
        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
        );
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`
        );

        if (!currentRes.ok) throw new Error('City not found');

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

        localStorage.setItem('lastCity', cityName);
        storeWeatherData(currentData, forecastData);

    } catch (err) {
        showError('City not found. Try another province.');
    } finally {
        toggleLoading(false);
    }
}

/* ===================== STORAGE ===================== */
function storeWeatherData(current, forecast) {
    const weatherData = {
        current,
        forecast,
        time: Date.now(),
        city: current.name,
        country: current.sys.country
    };
    localStorage.setItem('weatherData', JSON.stringify(weatherData));
    
    // Store city-specific data for history
    const cityKey = `weather_${current.name.toLowerCase()}`;
    localStorage.setItem(cityKey, JSON.stringify({
        current,
        forecast,
        timestamp: Date.now()
    }));
    
    // Add to weather history
    addToWeatherHistory(current.name);
    
    console.log('✓ Weather data stored in localStorage:', current.name);
}

/* ===================== HISTORY ===================== */
function addToWeatherHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    const entry = {
        city,
        timestamp: Date.now()
    };
    
    // Remove duplicate if exists
    history = history.filter(h => h.city.toLowerCase() !== city.toLowerCase());
    
    // Add new entry at the beginning
    history.unshift(entry);
    
    // Keep only last 20 searches
    history = history.slice(0, 20);
    
    localStorage.setItem('weatherHistory', JSON.stringify(history));
}

/* ===================== LOAD CACHE ===================== */
function loadStoredWeatherData() {
    const saved = localStorage.getItem('weatherData');
    if (!saved) return getWeather();

    const data = JSON.parse(saved);
    const cacheExpiry = 3600000; // 1 hour in milliseconds
    
    if (Date.now() - data.time < cacheExpiry) {
        console.log('✓ Loading cached weather data for:', data.city);
        displayCurrentWeather(data.current);
        displayForecast(data.forecast);
    } else {
        console.log('✗ Cache expired, fetching fresh data...');
        getWeather();
    }
}
function displayCurrentWeather(data) {
    const box = document.getElementById('weather-detail-today');
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    const tempUnit = unit === 'metric' ? '°C' : '°F';

    box.innerHTML = `
    <h2>Today's Weather</h2>
        <div class="weather-container">
            <div class="weather-header">
                <h1>${data.name}, ${data.sys.country}</h1>
                <p class="weather-desc">${data.weather[0].description}</p>
            </div>

            <div class="weather-main">
                <img src="${icon}" class="weather-icon">
                <div class="weather-temp">
                    <span class="temp">${Math.round(data.main.temp)}</span>
                    <span class="unit">${tempUnit}</span>
                    <p class="feels">Feels like ${Math.round(data.main.feels_like)}${tempUnit}</p>
                </div>
            </div>

            <div class="weather-info">
                <div>
                    <span>💧 Humidity</span>
                    <strong>${data.main.humidity}%</strong>
                </div>
                <div>
                    <span>💨 Wind</span>
                    <strong>${data.wind.speed} m/s</strong>
                </div>
                <div>
                    <span>🌅 Sunrise</span>
                    <strong>${formatTime(data.sys.sunrise)}</strong>
                </div>
                <div>
                    <span>🌇 Sunset</span>
                    <strong>${formatTime(data.sys.sunset)}</strong>
                </div>
            </div>

            <div class="weather-actions">
                <button onclick="toggleUnit()">°C / °F</button>
                <button onclick="saveFavorite('${data.name}')">⭐ Save</button>
                <button onclick="getWeather('${data.name}')">🔄 Refresh</button>
            </div>
        </div>
    `;
}



/* ===================== FORECAST ===================== */
function displayForecast(data) {
    const box = document.getElementById('weather-detail-seven-day');
    box.innerHTML = '<h2>7-Day Forecast</h2>';

    data.list
        .filter(i => i.dt_txt.includes('12:00:00'))
        .forEach(day => {
            box.innerHTML += `
                <div class="forecast-card">
                    <p>📆${new Date(day.dt * 1000).toDateString()}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                    <p>⛈️${day.main.temp}${unit === 'metric' ? '°C' : '°F'}</p>
                    <p>☁️${day.weather[0].description}</p>
                </div>
            `;
        });
}

/* ===================== HELPERS ===================== */
function formatTime(time) {
    return new Date(time * 1000).toLocaleTimeString();
}

function toggleUnit() {
    unit = unit === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem('unit', unit);
    getWeather();
}

function saveFavorite(city) {
    let fav = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!fav.includes(city)) fav.push(city);
    localStorage.setItem('favorites', JSON.stringify(fav));
    alert(`${city} saved!`);
}

function showError(msg) {
    document.getElementById('weather-detail-today').innerHTML =
        `<p style="color:red;text-align:center;">${msg}</p>`;
}

/* ===================== LOADING ===================== */
function toggleLoading(show) {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = show ? 'block' : 'none';
}

/* ===================== SEARCH & AUTOCOMPLETE ===================== */
document.getElementById('search-input')?.addEventListener('input', function () {
    const q = this.value.toLowerCase();
    const s = document.getElementById('suggestions');

    if (q.length < 2) return s.style.display = 'none';

    const list = cambodiaProvinces.filter(p => p.toLowerCase().includes(q));
    s.innerHTML = list.map(p => `<div class="suggestion-item">${p}</div>`).join('');
    s.style.display = list.length ? 'block' : 'none';
});

document.getElementById('suggestions')?.addEventListener('click', e => {
    if (e.target.classList.contains('suggestion-item')) {
        document.getElementById('search-input').value = e.target.textContent;
        getWeather(e.target.textContent);
        e.currentTarget.style.display = 'none';
    }
});

/* ===================== EVENTS ===================== */
document.getElementById('search-button')?.addEventListener('click', () =>
    getWeather(document.getElementById('search-input').value)
);

document.addEventListener('DOMContentLoaded', loadStoredWeatherData);


