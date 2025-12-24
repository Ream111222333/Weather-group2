const weatherContainer = document.querySelector('.weather-container');

// Example: change weather here
let weather = "cloudy"; // sunny | cloudy | rainy | storm

weatherContainer.className = `weather-container ${weather}`;
const hour = new Date().getHours();
const container = document.querySelector('.weather-container');

if (hour >= 6 && hour < 18) {
  container.style.background =
    "linear-gradient(to bottom, #5a8dee, #79b7ff)";
} else {
  container.style.background =
    "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
}
function setBg(type) {
  document.querySelector('.weather-container').className =
    `weather-container ${type}`;
}
