document.addEventListener("DOMContentLoaded", () => {

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
