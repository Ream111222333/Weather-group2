const API_KEY = 'YOUR_API_KEY'; 
const CITY = 'Phnom Penh';

async function updateWeatherCalendar() {
    try {
        // 1. Get Coordinates for the City
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${CITY}&limit=1&appid=${API_KEY}`);
        const geoData = await geoRes.json();
        const { lat, lon } = geoData[0];

        // 2. Get Weather Data (Current + 8 Day Forecast)
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const data = await weatherRes.json();

        renderHero(data.current);
        renderCalendar(data.daily);
    } catch (error) {
        console.error("Data fetch error:", error);
    }
}

function renderHero(current) {
    const today = new Date(); // Jan 1, 2026
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    
    document.querySelector('.today-box h4').innerText = today.toLocaleDateString('en-US', options);
    document.querySelector('.today-box h1').innerText = `${Math.round(current.temp)}°C`;
    document.querySelector('.big-card h2').innerText = today.getDate();
    
    const sunrise = new Date(current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.sun-info').innerHTML = `🌅 ${sunrise} &nbsp;&nbsp; 🌇 ${sunset}`;
}

function renderCalendar(forecastData) {
    const grid = document.getElementById('weather-grid');
    grid.innerHTML = ''; 

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Calculate alignment: What day of the week is the 1st?
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 4 = Thu
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. Add empty slots for previous month alignment
    for (let x = 0; x < firstDayIndex; x++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'card empty'; // Style these as transparent in CSS
        grid.appendChild(emptyDiv);
    }

    // 2. Add actual days of January
    for (let day = 1; day <= daysInMonth; day++) {
        const card = document.createElement('div');
        card.className = 'card';
        if (day === now.getDate()) card.classList.add('active'); // Highlight Today

        // Map forecast data to the first few days of the month
        // Forecast only gives ~8 days. We use day-1 because array starts at 0.
        const dayWeather = forecastData[day - 1];

        if (dayWeather) {
            const icon = dayWeather.weather[0].icon;
            card.innerHTML = `
                <p>${day}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather">
                <span>${Math.round(dayWeather.temp.max)}°C</span>
                <small>${Math.round(dayWeather.temp.min)}°C</small>
            `;
        } else {
            // Placeholder for future days where forecast isn't available yet
            card.innerHTML = `<p>${day}</p><div class="no-data">--</div>`;
        }
        grid.appendChild(card);
    }
}

updateWeatherCalendar();