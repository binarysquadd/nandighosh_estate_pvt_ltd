document.querySelector(".subscribe-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    console.log("Email submitted:", email);
    alert("Thank you for subscribing!");
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

document.getElementById("email").addEventListener("input", function() {
    const email = this.value;
    if (!validateEmail(email)) {
        this.setCustomValidity("Please enter a valid email address.");
    } else {
        this.setCustomValidity("");
    }
});

// Additional functionality can be added here as needed
