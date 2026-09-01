const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

// PUT YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const scriptURL = "https://script.google.com/macros/s/AKfycbwzzmGn4EI__0j8Wx03kQxOR6e8qh_kU76MGRM1admCh3BcyAUOw_xXmVAsinhG7czI2w/exec";

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

    // Check terms
    if (!document.getElementById("terms").checked) {
        message.textContent = "Please confirm that the information provided is correct.";
        message.style.color = "red";
        return;
    }

    // Format date of birth
    const dateOfBirthText =
        String(day).padStart(2, "0") + "/" +
        String(month).padStart(2, "0") + "/" +
        year;

    // Create data to send to Google Sheets
    const formData = new FormData();

    formData.append("fullname",
        document.getElementById("fullname").value
    );

    formData.append("dateOfBirth", dateOfBirthText);

    formData.append("gender",
        document.querySelector('input[name="gender"]:checked').value
    );

    formData.append("phone",
        document.getElementById("phone").value
    );

    formData.append("email",
        document.getElementById("email").value
    );

    formData.append("address",
        document.getElementById("address").value
    );

    formData.append("state",
        document.getElementById("state").value
    );

    formData.append("department",
        document.getElementById("department").value
    );

    formData.append("level",
        document.getElementById("level").value
    );

    formData.append("school",
        document.getElementById("school").value
    );

    // Change button text
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Send information to Google Sheets
    fetch(scriptURL, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        if (data.status === "success") {

            message.textContent =
                "Registration submitted successfully!";

            message.style.color = "green";

            // Reset form
            form.reset();

        } else {

            message.textContent =
                "Something went wrong. Please try again.";

            message.style.color = "red";
        }
    })
    .catch(error => {

        console.error("Error:", error);

        message.textContent =
            "Unable to submit registration. Please check your internet connection.";

        message.style.color = "red";

    })
    .finally(() => {

        submitButton.disabled = false;
        submitButton.textContent = "Register Now";

    });
});
