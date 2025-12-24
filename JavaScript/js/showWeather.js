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
    localStorage.setItem('weatherData', JSON.stringify({
        current,
        forecast,
        time: Date.now()
    }));
}

/* ===================== LOAD CACHE ===================== */
function loadStoredWeatherData() {
    const saved = localStorage.getItem('weatherData');
    if (!saved) return getWeather();

    const data = JSON.parse(saved);
    if (Date.now() - data.time < 3600000) {
        displayCurrentWeather(data.current);
        displayForecast(data.forecast);
    } else {
        getWeather();
    }
}

/* ===================== DISPLAY CURRENT ===================== */
function displayCurrentWeather(data) {
    const box = document.getElementById('weather-detail-today');
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const tempUnit = unit === 'metric' ? '°C' : '°F';

    box.innerHTML = `
       <h2>Today's Weather from Cambodia</h2>
       
        <div class="weather-card">
     
            <h2 style="color: #f5f5f5ff;">${data.name}, ${data.sys.country}</h2>
            <img src="${icon}">
            <p><strong>${data.main.temp}${tempUnit}</strong> (Feels like ${data.main.feels_like}${tempUnit})</p>
            <p>${data.weather[0].description}</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>💨 Wind: ${data.wind.speed}</p>
            <p>🌅 Sunrise: ${formatTime(data.sys.sunrise)}</p>
            <p>🌇 Sunset: ${formatTime(data.sys.sunset)}</p>

            <div class="weather-actions">
                <button onclick="toggleUnit()">Toggle °C / °F</button>
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
