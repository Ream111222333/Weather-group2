const apiKey = 'bd1b0d9c907f21d41c7e880436ab3832';
const unit = 'metric';

async function getWeatherData(cityInput) {
    const cityName = cityInput || localStorage.getItem('lastCity') || 'Phnom Penh';
    try {
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`);
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}`);

        if (!currentRes.ok) throw new Error(`City not found.`);

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        hideError();
        localStorage.setItem('lastCity', cityName);
    } catch (err) {
        showError(err.message);
    }
}

function displayCurrentWeather(data) {
    document.querySelector('.city').textContent = `📍 ${data.name}, ${data.sys.country}`;
    document.querySelector('.current h1').textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    document.querySelector('.current h2').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    document.querySelector('.status').textContent = data.weather[0].description.toUpperCase();
    document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
    document.querySelector('.sunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    document.querySelector('.sunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    document.querySelector('.current-center img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

function displayForecast(data) {
    const forecastDaysElements = document.querySelectorAll('.forecast-day');
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    // 1. Create a map of available data by Day Index (0-6)
    // We pick the forecast point closest to 12:00 PM for each day
    const dataMap = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayIdx = date.getDay();
        const hour = date.getHours();

        if (!dataMap[dayIdx] || Math.abs(hour - 12) < Math.abs(new Date(dataMap[dayIdx].dt * 1000).getHours() - 12)) {
            dataMap[dayIdx] = item;
        }
    });

    // 2. Map to your HTML order: [MON, TUE, WED, THU, FRI, SAT, SUN]
    const htmlOrder = [1, 2, 3, 4, 5, 6, 0]; 

    htmlOrder.forEach((dayIdx, i) => {
        if (forecastDaysElements[i]) {
            const dayData = dataMap[dayIdx];
            const dayEl = forecastDaysElements[i];

            // Set the Header (e.g., MON, TUE)
            dayEl.querySelector('p:first-child').textContent = dayNames[dayIdx];

            if (dayData) {
                // Update Image
                dayEl.querySelector('img').src = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
                // Update Temps
                dayEl.querySelector('p:last-child').textContent = `${Math.round(dayData.main.temp_max)}°C / ${Math.round(dayData.main.temp_min)}°C`;
                dayEl.style.opacity = "1";
            }  
            else {
                const img = dayEl.querySelector('img');

                // fallback icon
                img.src = "https://openweathermap.org/img/wn/04d@2x.png";
                img.alt = "Cloudy";

                // 🔥 find nearest available temperature
                const nearest = Object.values(dataMap)[0];

                if (nearest) {
                    dayEl.querySelector('p:last-child').textContent =
                        `${Math.round(nearest.main.temp_max)}°C / ${Math.round(nearest.main.temp_min)}°C`;
                } else {
                    dayEl.querySelector('p:last-child').textContent = "--°C / --°C";
                }

                dayEl.style.opacity = "1";
            }


        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData();
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');

    searchBtn.addEventListener('click', () => {
        if (cityInput.value.trim()) getWeatherData(cityInput.value.trim());
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cityInput.value.trim()) getWeatherData(cityInput.value.trim());
    });
});

function showError(msg) {
    const err = document.getElementById('error-message');
    if(err) {
        err.textContent = msg;
        err.style.display = 'block';
    }
}

function hideError() {
    const err = document.getElementById('error-message');
    if(err) err.style.display = 'none';
}

