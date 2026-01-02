// ===================== Profile JS =====================

// Wrap all code in DOMContentLoaded to ensure HTML is loaded
document.addEventListener("DOMContentLoaded", () => {

  // ---------------- Profile Display Elements ----------------
  const profilePicture = document.getElementById("profile"); // Main profile image
  const profileIcon = document.getElementById("profile-icon"); // Topbar icon
  const profileName = document.getElementById("profile-name");
  const nameDetail = document.getElementById("name-detail");
  const emailDetail = document.getElementById("email-detail");
  const locationDetail = document.getElementById("location-detail");
  const dateJoined = document.getElementById("date-sign");

  // ---------------- Edit Form Elements ----------------
  const editForm = document.querySelector(".edit-profile-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const locationInput = document.getElementById("location");
  const profilePicInput = document.getElementById("profile-pic");
  const profilePicPreview = document.getElementById("profile-pic-preview");
  const saveButton = document.querySelector(".save-btn");
  const cancelButton = document.querySelector(".cancel-btn");

  const DEFAULT_PROFILE = "../../assets/image/none_profile.png";

  // ---------------- Load Profile Display ----------------
  const loadProfileData = () => {
    const data = JSON.parse(localStorage.getItem("registrationData"));

    console.log("Loaded Profile Data:", data);

    if (!data) {
      console.warn("No profile data found.");
      if (profileName) profileName.textContent = "No profile data found.";
      return;
    }

    if (profilePicture) profilePicture.src = data.Profile || DEFAULT_PROFILE;
    if (profileIcon) profileIcon.src = data.Profile || DEFAULT_PROFILE;
    if (profileName) profileName.textContent = data.Name || "Unknown User";
    if (nameDetail) nameDetail.textContent = data.Name || "Unknown User";
    if (emailDetail) emailDetail.textContent = data.Email || "Email not provided";
    if (locationDetail) locationDetail.textContent = data.Location || "Location not provided";

    if (dateJoined) {
      const currentDate = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      dateJoined.textContent = currentDate.toLocaleString(undefined, options);
    }
  };

  loadProfileData();

  // ---------------- Load Form Data ----------------
  const loadFormData = () => {
    const existingData = JSON.parse(localStorage.getItem("registrationData"));

    if (!existingData) return;

    if (nameInput) nameInput.value = existingData.Name || "";
    if (emailInput) emailInput.value = existingData.Email || "";
    if (locationInput) locationInput.value = existingData.Location || "";
    if (profilePicPreview) profilePicPreview.src = existingData.Profile || DEFAULT_PROFILE;
    if (profilePicture) profilePicture.src = existingData.Profile || DEFAULT_PROFILE;
  };

  loadFormData();

  // ---------------- Profile Picture Preview ----------------
  if (profilePicInput && profilePicPreview) {
    profilePicInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        profilePicPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ---------------- Save Profile Changes ----------------
  if (saveButton && editForm) {
    saveButton.addEventListener("click", (e) => {
      e.preventDefault();

      const updatedData = {
        Name: nameInput?.value || "",
        Email: emailInput?.value || "",
        Location: locationInput?.value || "",
        Profile: profilePicPreview?.src || DEFAULT_PROFILE
      };

      localStorage.setItem("registrationData", JSON.stringify(updatedData));

      loadProfileData(); // Update profile display

      alert("Profile updated successfully!");
    });
  }

  // ---------------- Cancel Editing ----------------
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      loadFormData(); // Reset form fields
    });
  }

});
