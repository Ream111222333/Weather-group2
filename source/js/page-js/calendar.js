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
