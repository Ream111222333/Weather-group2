const API_KEY = "bd1b0d9c907f21d41c7e880436ab3832";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/onecall";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const defaultCity = "Phnom Penh";

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city) fetchWeather(city);
});

// Fetch current weather & forecast
async function fetchWeather(city) {
    try {
        // Get city coordinates
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const geoData = await geoRes.json();
        if (!geoData[0]) return alert("City not found");

        const { lat, lon } = geoData[0];

        // Get weather data (current, daily, hourly)
        const weatherRes = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherRes.json();

        updateToday(weatherData.current, weatherData.daily);
        updateForecast(weatherData.daily);
        updateHourly(weatherData.hourly);
    } catch (err) {
        console.error(err);
        alert("Error fetching weather data.");
    }
}

// Update today's weather
function updateToday(current, daily) {
    const todayBox = document.getElementById("today-box");
    const date = new Date(current.dt * 1000);
    const options = { weekday: "long", month: "long", day: "numeric" };
    todayBox.innerHTML = `
        <h4>${date.toLocaleDateString(undefined, options)}</h4>
        <h1>${Math.round(current.temp)}°C</h1>
        <img src="${getLocalWeatherImage(current.weather[0].main)}" alt="${current.weather[0].description}">
        <p>${current.weather[0].description}</p>
        <div class="sun-info">🌅 ${new Date(daily[0].sunrise * 1000).toLocaleTimeString()} &nbsp;&nbsp; 🌇 ${new Date(daily[0].sunset * 1000).toLocaleTimeString()}</div>
    `;
}

// Update daily forecast
function updateForecast(daily) {
    const weatherGrid = document.getElementById("weather-grid");
    weatherGrid.innerHTML = "";
    daily.forEach((day, index) => {
        const date = new Date(day.dt * 1000);
        weatherGrid.innerHTML += `
            <div class="card ${index === 0 ? 'dark' : ''}">
                <p>${date.getDate()}</p>
                <img src="${getLocalWeatherImage(day.weather[0].main)}" alt="${day.weather[0].description}">
                <span>${Math.round(day.temp.day)}°C</span>
                <small>${Math.round(day.temp.night)}°C</small>
            </div>
        `;
    });
}

// Update hourly forecast
function updateHourly(hourly) {
    const hourlyDiv = document.getElementById("hourly-forecast");
    hourlyDiv.innerHTML = "";
    hourly.slice(0, 12).forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const hourStr = date.getHours() + ":00";
        hourlyDiv.innerHTML += `
            <div class="hour-card">
                <p>${hourStr}</p>
                <img src="${getLocalWeatherImage(hour.weather[0].main)}" alt="${hour.weather[0].description}">
                <span>${Math.round(hour.temp)}°C</span>
            </div>
        `;
    });
}

// Map weather main types to local images
function getLocalWeatherImage(weatherMain) {
    switch (weatherMain) {
        case "Clear": return "../../assets/image-icon/sun.png";
        case "Clouds": return "../../assets/image-icon/black.png";
        case "Rain": return "../../assets/image-icon/rain.png";
        case "Snow": return "../../assets/image-icon/snow.png";
        default: return "../../assets/image-icon/sun.png";
    }
}

// Highlight current date in calendar
document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const localDate = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }));
    const todayString = `${localDate.getFullYear().toString().padStart(4,'0')}-${(localDate.getMonth()+1).toString().padStart(2,'0')}-${localDate.getDate().toString().padStart(2,'0')}`;
    const todayElement = document.querySelector(`[data-date="${todayString}"]`);
    if (todayElement) todayElement.classList.add("active");

    fetchWeather(defaultCity);
});
// Function to update weather panel dynamically
function updateWeatherPanel(currentWeather) {
    const today = new Date();

    // Format date like "Monday, January 15"
    const options = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString(undefined, options);
    document.getElementById("weather-date").textContent = formattedDate;

    // Update temperature if available from API
    if (currentWeather && currentWeather.temp) {
        document.getElementById("weather-temperature").textContent = `${Math.round(currentWeather.temp)}°C`;
    }

    // Update sunrise/sunset times if available from API
    if (currentWeather && currentWeather.sunrise && currentWeather.sunset) {
        const sunrise = new Date(currentWeather.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(currentWeather.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById("sunrise-time").textContent = sunrise;
        document.getElementById("sunset-time").textContent = sunset;
    }
}

// Call the function on page load with no weather yet (just date)
document.addEventListener("DOMContentLoaded", () => updateWeatherPanel());
// Highlight today's card and update with current weather
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const todayDay = today.getDate(); // Day number
    const todayString = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    // Select all cards
    const cards = document.querySelectorAll(".weather-grid .card");

    cards.forEach(card => {
        const cardDay = parseInt(card.querySelector("p").textContent);

        if (cardDay === todayDay) {
            card.classList.add("active"); // Highlight today
            // Replace content with "today-box"-style info
            card.innerHTML = `
                <p>${todayDay}</p>
                <img src="https://openweathermap.org/img/wn/01d@2x.png" alt="Sunny">
                <span id="today-temp">29°C</span>
                <small id="sun-info">🌅 06:15 &nbsp;&nbsp; 🌇 17:42</small>
            `;
        }
    });
});
