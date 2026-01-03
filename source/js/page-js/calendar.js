const cards = document.querySelectorAll(".weather-card");

cards.forEach(card => {
    card.addEventListener("click", () => {

        // remove active
        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        // get data
        const date = card.querySelector(".date").innerText;
        const temp = card.querySelector(".temperature").innerText.split("\n")[0];
        const icon = card.querySelector("img").src;

        // update panel
        document.getElementById("weather-date").innerText =
            `Selected Date: ${date}`;
        document.getElementById("weather-temperature").innerText = temp;
        document.getElementById("calendar-icon").src = icon;
    });
});
async function updateWeatherCalendar() {
    // 1. Get Current Date Info
    const now = new Date();
    const currentDay = now.getDate();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const dayName = now.toLocaleString('default', { weekday: 'long' });

    // 2. Update the Right Panel (Today's Box)
    const todayBox = document.querySelector('.today-box');
    if (todayBox) {
        todayBox.querySelector('h4').innerText = `${dayName}, ${monthName} ${currentDay}`;
        todayBox.querySelector('.big-card h2').innerText = currentDay;
    }

    // 3. Fetch 31-day forecast (using Open-Meteo for real-time data)
    try {
        // Automatically detects user's location via browser IP
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const { latitude, longitude } = geoData;

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
        const weatherData = await weatherRes.json();

        // 4. Map Data to your existing .card elements
        const cards = document.querySelectorAll('.weather-grid .card');
        
        cards.forEach((card, index) => {
            const tempMax = Math.round(weatherData.daily.temperature_2m_max[index]);
            const tempMin = Math.round(weatherData.daily.temperature_2m_min[index]);
            const code = weatherData.daily.weathercode[index];

            // Update Temperature spans
            const mainTemp = card.querySelector('span');
            const lowTemp = card.querySelector('small');
            if (mainTemp) mainTemp.innerText = `${tempMax}°C`;
            if (lowTemp) lowTemp.innerText = `${tempMin}°C`;

            // Update Icons based on WMO Weather Codes
            const img = card.querySelector('img');
            if (img) {
                img.src = getWeatherIcon(code);
            }

            // Sync the Today Box temperature with the current day's high
            if (index + 1 === currentDay && todayBox) {
                todayBox.querySelector('h1').innerText = `${tempMax}°C`;
            }
        });

    } catch (error) {
        console.error("Weather update failed:", error);
    }
}

// Helper function to map WMO codes to OpenWeather icons (which your code uses)
function getWeatherIcon(code) {
    if (code === 0) return "https://openweathermap.org/img/wn/01d@2x.png"; // Clear
    if (code <= 3) return "https://openweathermap.org/img/wn/02d@2x.png"; // Partly Cloudy
    if (code <= 48) return "https://openweathermap.org/img/wn/03d@2x.png"; // Fog
    if (code <= 67) return "https://openweathermap.org/img/wn/09d@2x.png"; // Rain
    if (code <= 77) return "https://openweathermap.org/img/wn/13d@2x.png"; // Snow
    return "https://openweathermap.org/img/wn/11d@2x.png"; // Thunderstorm
}

// Run on load
updateWeatherCalendar();
function alignCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // January is 0

    // 1. Find which day of the week the 1st falls on
    // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu...
    const firstDayIndex = new Date(year, month, 1).getDay();

    // 2. Select all your existing cards
    const cards = document.querySelectorAll('.weather-grid .card');
    
    // 3. Loop through your 31 cards
    cards.forEach((card, index) => {
        const dateNumberElement = card.querySelector('p');
        const dateValue = index - firstDayIndex + 1;

        if (dateValue > 0 && dateValue <= 31) {
            // This is a valid day for this month
            dateNumberElement.innerText = dateValue;
            card.style.visibility = "visible"; // Show the card
            card.style.opacity = "1";
            
            // Highlight today (January 3rd)
            if (dateValue === now.getDate()) {
                card.style.border = "2px solid #00d2ff";
                card.style.background = "rgba(0, 210, 255, 0.1)";
            }
        } else {
            // This card is an "empty" spot before the 1st or after the 31st
            dateNumberElement.innerText = "";
            card.style.visibility = "hidden"; // Hide unused cards to keep alignment
        }
    });

    // 4. Update the Month Display (Optional: if you have a header)
    const monthYearString = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    const header = document.querySelector('.calendar-box h3');
    if (header) {
        header.innerText = `Weather Forecast - ${monthYearString}`;
    }
}

// Run the alignment
alignCalendar();