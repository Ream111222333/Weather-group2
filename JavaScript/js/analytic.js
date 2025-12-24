document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    let temperatureChart;

    // Initialize the chart with empty data
    function initializeChart() {
        temperatureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Temperature (°C)',
                    data: Array(7).fill(null), // Placeholder data
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function to save data in local storage
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Function to retrieve data from local storage
    function getFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null; // Return parsed data or null if not found
    }

    // Function to fetch weather data from your API
    async function fetchWeather(city) {
        try {
            const response = await fetch(`http://localhost:3000/weather?city=${city}`);
            const data = await response.json();
            
            // Store the fetched data in local storage
            saveToLocalStorage('weatherData', data);
            
            // Extract weekly temperatures and save them in local storage
            const weeklyTemperatures = [
                data.daily[0].temp.day,
                data.daily[1].temp.day,
                data.daily[2].temp.day,
                data.daily[3].temp.day,
                data.daily[4].temp.day,
                data.daily[5].temp.day,
                data.daily[6].temp.day
            ];
            saveToLocalStorage('weeklyTemperatures', weeklyTemperatures);

            // Display the fetched weather data
            displayWeather(data);
            updateChart(weeklyTemperatures); // Update the chart with the fetched data
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    // Function to display weather data
    function displayWeather(weatherData) {
        document.getElementById('today-date').innerText = new Date().toLocaleDateString();
        document.getElementById('place-name').innerText = `Location: ${weatherData.name}`;
        document.getElementById('today-temperature').innerText = `Temperature: ${weatherData.main.temp}°C`;
        document.getElementById('today-condition').innerText = `Condition: ${weatherData.weather[0].description}`;
        document.getElementById('today-humidity').innerText = `Humidity: ${weatherData.main.humidity}%`;
    }

    // Function to update the temperature chart
    function updateChart(weeklyTemperatures) {
        temperatureChart.data.datasets[0].data = weeklyTemperatures; // Set new temperature data from local storage
        temperatureChart.update(); // Update the chart
    }

    // Function to display weather data from local storage
    function displayWeatherFromLocalStorage() {
        const weatherData = getFromLocalStorage('weatherData');

        if (weatherData) {
            displayWeather(weatherData);
            
            // Retrieve weekly temperatures from local storage
            const weeklyTemperatures = getFromLocalStorage('weeklyTemperatures');
            if (weeklyTemperatures) {
                updateChart(weeklyTemperatures); // Update chart with data from local storage
            } else {
                console.log('No weekly temperature data found in local storage.');
            }
        } else {
            console.log('No weather data found in local storage.');
        }
    }

    // Initialize the chart
    initializeChart();

    // Fetch weather for a specific city and display it
    fetchWeather('London').then(() => {
        displayWeatherFromLocalStorage();
    });
});