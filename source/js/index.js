// Load countries from JSON
let countries = [];

fetch('./source/js/country.json')
  .then(response => response.json())
  .then(data => {
    countries = data.countries;
    initializeApp();
  });

// Initialize app
function initializeApp() {
  const { country, city } = Storage.getLocation();
  updateCountryDropdown(country);
  updateCityDropdown(country);
}

// Update city list based on country
function updateCityDropdown(selectedCountry) {
  const countryObj = countries.find(c => c.name === selectedCountry);
  const citySelect = document.getElementById('citySelect');
  
  if (!citySelect) return;
  
  citySelect.innerHTML = '';
  if (countryObj) {
    countryObj.cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
    citySelect.value = city;
  }
}

// Update country dropdown
function updateCountryDropdown(selectedCountry) {
  const countrySelect = document.getElementById('countrySelect');
  if (!countrySelect) return;
  
  countrySelect.innerHTML = '';
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.name;
    option.textContent = country.name;
    countrySelect.appendChild(option);
  });
  countrySelect.value = selectedCountry;
}

document.addEventListener("DOMContentLoaded", () => {
  // Country and city selection
  const countrySelect = document.getElementById('countrySelect');
  const citySelect = document.getElementById('citySelect');
  
  if (countrySelect) {
    countrySelect.addEventListener('change', (e) => {
      updateCityDropdown(e.target.value);
      Storage.saveLocation(e.target.value, citySelect.value);
    });
  }
  
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      const countrySelect = document.getElementById('countrySelect');
      Storage.saveLocation(countrySelect.value, e.target.value);
    });
  }

  /* ================= Navigation Hover ================= */
  const list = document.querySelectorAll(".navigation li");

  function activeLink() {
    list.forEach(item => item.classList.remove("hovered"));
    this.classList.add("hovered");
  }

  list.forEach(item => {
    item.addEventListener("mouseover", activeLink);
  });

  /* ================= Menu Toggle ================= */
  const toggle = document.querySelector(".toggle");
  const navigation = document.querySelector(".navigation");
  const main = document.querySelector(".main");

  if (toggle && navigation && main) {
    toggle.onclick = () => {
      navigation.classList.toggle("active");
      main.classList.toggle("active");
    };
  }

  /* ================= Card Box ================= */
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("mouseover", () => {
      cards.forEach(c => c.style.animationPlayState = "paused");
    });

    card.addEventListener("mouseout", () => {
      cards.forEach(c => c.style.animationPlayState = "running");
    });
  });

  /* ================= Profile ================= */
  const profile = document.querySelector(".profile");
  const editContainer = document.querySelector(".edite-container");
  const editBtn = document.getElementById("btn-edit-profile");
  const cancelBtn = document.querySelector(".cancel-btn");

  if (editBtn && profile && editContainer) {
    editBtn.addEventListener("click", () => {
      profile.classList.add("none-container");
      editContainer.classList.add("display");
    });
  }

  if (cancelBtn && profile && editContainer) {
    cancelBtn.addEventListener("click", () => {
      profile.classList.remove("none-container");
      editContainer.classList.remove("display");
    });
  }

  /* ================= Edit Profile Form ================= */
  const form = document.querySelector(".edit-profile-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value;
      const email = document.getElementById("email")?.value;
      const location = document.getElementById("location")?.value;

      if (name && email && location) {
        alert("Profile updated successfully!");
      } else {
        alert("Please fill out all fields!");
      }
    });
  }

  /* ================= Profile Picture Preview ================= */
  const profilePicInput = document.getElementById("profile-pic");
  const profilePicPreview = document.getElementById("profile-pic-preview");

  if (profilePicInput && profilePicPreview) {
    profilePicInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        profilePicPreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

});
