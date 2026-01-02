// Profile Display Elements
const profiPicture = document.getElementById("profile");
const proPicture = document.getElementById("profile-icon");
const profileName = document.getElementById("profile-name");
const namePro = document.getElementById("name-detail");
const emailProfile = document.getElementById("email-detail");
const locationProfile = document.getElementById("location-detail");
const dateProfile = document.getElementById("date-sign");
// Edit Form Elements
const loadProfileData = () => {
    const data = JSON.parse(localStorage.getItem("registrationData"));

    console.log("Loaded Profile Data:", data); // Debugging line

    if (data) {
        proPicture.src = data.Profile || 'assets/image/none_profile.png'; // Fallback to default image
        profiPicture.src = data.Profile || 'assets/image/none_profile.png'; // Fallback to default image
        profileName.textContent = data.Name || "Unknown User";
        namePro.textContent = data.Name || "Unknown User";
        emailProfile.textContent = data.Email || "Email not provided";
        locationProfile.textContent = data.Location || "Location not provided";

        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateProfile.textContent = ` ${currentDate.toLocaleString(undefined, options)}`;
    } else {
        console.log("No profile data found."); // Debugging line
        profileName.textContent = "No profile data found.";
    }
};

// Call function to load profile data when the page loads
 loadProfileData();

 // Elements for Editing Profile
 const editProfileForm = document.querySelector(".edit-profile-form");
 const nameInput = document.getElementById("name");
 const emailInput = document.getElementById("email");
 const locationInput = document.getElementById("location");
 const profilePicInput = document.getElementById("profile-pic");
 const profilePicPreview = document.getElementById("profile-pic-preview");
 const saveButton = document.querySelector(".save-btn");
 const cancelButton = document.querySelector(".cancel-btn");

 // Load existing data into the form
 const loadFormData = () => {
     const existingData = JSON.parse(localStorage.getItem("registrationData"));

     if (existingData) {
         nameInput.value = existingData.Name || "";
         emailInput.value = existingData.Email || "";
         locationInput.value = existingData.Location || "";
         profilePicPreview.src = existingData.Profile || "../../assets/image/none_profile.png";
         profiPicture.src = existingData.Profile || "../../assets/image/none_profile.png";
     }
 };

 // Call function to load form data
 loadFormData();

 // Preview uploaded profile picture
 profilePicInput.addEventListener("change", function () {
     const file = this.files[0];
     if (file) {
         const reader = new FileReader();
         reader.onload = function (e) {
             profilePicPreview.src = e.target.result;
         };
         reader.readAsDataURL(file);
     }
 });

 // Save profile changes
 saveButton.addEventListener("click", function (e) {
     e.preventDefault();

     const updatedData = {
         Name: nameInput.value,
         Email: emailInput.value,
         Location: locationInput.value,
         Profile: profilePicPreview.src
     };

     // Save updated data to localStorage
     localStorage.setItem("registrationData", JSON.stringify(updatedData));

     // Update profile display
     loadProfileData();

     alert("Profile updated successfully!");
 });

 // Cancel editing
 cancelButton.addEventListener("click", function () {
     loadFormData(); // Reset form fields to existing data
 });
//=====================profile=================================//