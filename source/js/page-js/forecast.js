const weather = document.querySelector('.weather-container');

// Example: change weather here
let weathers = "cloudy"; // sunny | cloudy | rainy | storm

weather.className = `weather ${weather}`;
const hour = new Date().getHours();
const container = document.querySelector('.weather');

if (hour >= 6 && hour < 18) {
  container.style.background =
    "linear-gradient(to bottom, #5a8dee, #79b7ff)";
} else {
  container.style.background =
    "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
}
function setBg(type) {
  document.querySelector('.weather').className =
    `weather ${type}`;
}
