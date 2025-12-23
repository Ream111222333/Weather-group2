const container = document.getElementById('main-form-container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function loadFile(event) {
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.style.display = 'block'; // Show the image
}