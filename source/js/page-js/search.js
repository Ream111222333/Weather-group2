// Enhanced Search with Autocomplete
let countryData = [];

// Load countries on page load
fetch('./source/js/country.json')
  .then(response => response.json())
  .then(data => {
    countryData = data.countries;
  });

// Get all cities from selected country
function getCitiesForCountry(countryName) {
  const country = countryData.find(c => c.name === countryName);
  return country ? country.cities : [];
}

// Show autocomplete suggestions
document.getElementById("search-input")?.addEventListener("input", function (e) {
  const searchValue = e.target.value.toLowerCase().trim();
  const suggestionsDiv = document.getElementById("suggestions");

  if (!suggestionsDiv) return;

  if (searchValue.length < 1) {
    suggestionsDiv.style.display = "none";
    return;
  }

  // Get current country from dropdown
  const countrySelect = document.getElementById("countrySelect");
  const selectedCountry = countrySelect ? countrySelect.value : "Cambodia";
  const cities = getCitiesForCountry(selectedCountry);

  // Filter matching cities
  const matches = cities.filter(city => 
    city.toLowerCase().includes(searchValue)
  );

  if (matches.length === 0) {
    suggestionsDiv.style.display = "none";
    return;
  }

  // Display suggestions
  suggestionsDiv.innerHTML = matches
    .slice(0, 8)
    .map(city => `<div class="suggestion-item" onclick="selectCity('${city}')">${city}</div>`)
    .join("");
  
  suggestionsDiv.style.display = "block";
});

// Select city from suggestion
function selectCity(city) {
  const searchInput = document.getElementById("search-input");
  const citySelect = document.getElementById("citySelect");
  
  if (searchInput) searchInput.value = city;
  if (citySelect) citySelect.value = city;
  
  const suggestionsDiv = document.getElementById("suggestions");
  if (suggestionsDiv) suggestionsDiv.style.display = "none";
  
  // Save to localStorage
  const countrySelect = document.getElementById("countrySelect");
  const country = countrySelect ? countrySelect.value : "Cambodia";
  Storage.saveLocation(country, city);
  
  // Fetch weather with the exact city name
  getWeather(city);
}

// Search on Enter key
document.getElementById("search-input")?.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const city = this.value.trim();
    if (city) {
      selectCity(city);
    }
  }
});

// Search on button click
document.getElementById("search-button")?.addEventListener("click", function () {
  const searchInput = document.getElementById("search-input");
  const city = searchInput ? searchInput.value.trim() : "";
  
  if (city) {
    selectCity(city);
  } else {
    alert("Please enter a city name");
  }
});

// Close suggestions when clicking outside
document.addEventListener("click", function (e) {
  const suggestionsDiv = document.getElementById("suggestions");
  const searchInput = document.getElementById("search-input");
  
  if (suggestionsDiv && 
      !suggestionsDiv.contains(e.target) && 
      !searchInput.contains(e.target)) {
    suggestionsDiv.style.display = "none";
  }
});



