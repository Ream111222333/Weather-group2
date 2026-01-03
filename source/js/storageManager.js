// Simple LocalStorage Manager
const Storage = {
  // Save selected country and city
  saveLocation(country, city) {
    localStorage.setItem('selectedCountry', country);
    localStorage.setItem('selectedCity', city);
  },

  // Get selected country and city
  getLocation() {
    return {
      country: localStorage.getItem('selectedCountry') || 'Cambodia',
      city: localStorage.getItem('selectedCity') || 'Phnom Penh'
    };
  },

  // Save weather data
  saveWeather(data) {
    localStorage.setItem('weatherData', JSON.stringify(data));
  },

  // Get weather data
  getWeather() {
    const data = localStorage.getItem('weatherData');
    return data ? JSON.parse(data) : null;
  },

  // Save favorites
  saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  },

  // Get favorites
  getFavorites() {
    const data = localStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  },

  // Add favorite
  addFavorite(city) {
    let favorites = this.getFavorites();
    if (!favorites.includes(city)) {
      favorites.push(city);
      this.saveFavorites(favorites);
    }
  },

  // Clear all
  clear() {
    localStorage.clear();
  }
};
