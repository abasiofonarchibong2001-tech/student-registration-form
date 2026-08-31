const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get date of birth values
    const day = Number(document.getElementById("day").value);
    const month = Number(document.getElementById("month").value);
    const year = Number(document.getElementById("year").value);

    // Get password values
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check date of birth
    const dateOfBirth = new Date(year, month - 1, day);

    if (
        dateOfBirth.getFullYear() !== year ||
        dateOfBirth.getMonth() !== month - 1 ||
        dateOfBirth.getDate() !== day
    ) {
        message.textContent = "Please select a valid date of birth.";
        message.style.color = "red";
        return;
    }

    // Prevent future date of birth
    const today = new Date();

    if (dateOfBirth > today) {
        message.textContent = "Date of birth cannot be in the future.";
        message.style.color = "red";
        return;
    }

    // Check passwords
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "red";
        return;
    }

    // Successful registration
    message.textContent = "Registration submitted successfully!";
    message.style.color = "green";

    // Reset form
    form.reset();
});