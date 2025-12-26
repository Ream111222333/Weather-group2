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

    document.addEventListener('DOMContentLoaded', function() {  



        // Function to validate username (must have at least one uppercase and one lowercase)
        function validateUsername(username) {
            const uppercase = /[A-Z]/;
            const lowercase = /[a-z]/;
            if (uppercase.test(username) && lowercase.test(username)) {
                return true;
            } else {
                alert("Username must contain both uppercase and lowercase letters.");
                return false;
            }
        }

        // Function to validate password (must be at least 8 characters)
        function validatePassword(password) {
            if (password.length >= 8) {
                return true;
            } else {
                alert("Password must be at least 8 characters long.");
                return false;
            }
        }

        // Function to validate the registration form
        function validateRegisterForm() {
            const username = document.getElementById('name').value;
            const password = document.getElementById('password').value;

            if (validateUsername(username) && validatePassword(password)) {
                return true;
            } else {
                return false;
            }
        }

        // Add event listener for register button
        const registerBtn = document.getElementById('submit-register');
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form from submitting automatically
            if (validateRegisterForm()) {
                alert("Form submitted successfully!");
                // Here you can submit the form or redirect
                window.location.href = "../../index.html";

            }
        });

        // Example: function to check login form
        function validateLoginForm() {
            const email = document.getElementById('email-login').value;
            const password = document.getElementById('password-login').value;

            if (!email || !password) {
                alert("Please fill in both email and password.");
                return false;
            }
            return true;
        }

        const loginBtn = document.getElementById('submit-login');
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateLoginForm()) {
                alert("Login successful!");
                window.location.href = "../../index.html";
                // Here you can handle login
            }
        });

        // Function for displaying uploaded profile picture
        function loadFile(event) {
            const output = document.getElementById('output');
            output.src = URL.createObjectURL(event.target.files[0]);
            output.style.display = 'block';
        }
        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', loadFile);
    });

    console.log("Add New Account JavaScript is Running");


