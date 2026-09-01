const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

// GOOGLE APPS SCRIPT WEB APP URL
const scriptURL =
    "https://script.google.com/macros/s/AKfycbwzzmGn4EI__0j8Wx03kQxOR6e8qh_kU76MGRM1admCh3BcyAUOw_xXmVAsinhG7czI2w/exec";


form.addEventListener("submit", async function(event) {

    event.preventDefault();


    // --------------------------------
    // GET FORM VALUES
    // --------------------------------

    const day =
        Number(document.getElementById("day").value);

    const month =
        Number(document.getElementById("month").value);

    const year =
        Number(document.getElementById("year").value);


    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    const passport =
        document.getElementById("passport").files[0];


    // --------------------------------
    // CHECK DATE OF BIRTH
    // --------------------------------

    const dateOfBirth =
        new Date(year, month - 1, day);


    if (
        dateOfBirth.getFullYear() !== year ||
        dateOfBirth.getMonth() !== month - 1 ||
        dateOfBirth.getDate() !== day
    ) {

        message.textContent =
            "Please select a valid date of birth.";

        message.style.color = "red";

        return;
    }


    // --------------------------------
    // PREVENT FUTURE DATE
    // --------------------------------

    const today = new Date();

    if (dateOfBirth > today) {

        message.textContent =
            "Date of birth cannot be in the future.";

        message.style.color = "red";

        return;
    }


    // --------------------------------
    // CHECK PASSWORDS
    // --------------------------------

    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        message.style.color = "red";

        return;
    }


    // --------------------------------
    // CHECK TERMS
    // --------------------------------

    if (!document.getElementById("terms").checked) {

        message.textContent =
            "Please confirm that the information provided is correct.";

        message.style.color = "red";

        return;
    }


    // --------------------------------
    // CHECK PASSPORT
    // --------------------------------

    if (!passport) {

        message.textContent =
            "Please upload your passport photograph.";

        message.style.color = "red";

        return;
    }


    // Maximum passport size: 2MB
    const maxSize = 2 * 1024 * 1024;

    if (passport.size > maxSize) {

        message.textContent =
            "Passport photograph must not be larger than 2MB.";

        message.style.color = "red";

        return;
    }


    // Check file type
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!allowedTypes.includes(passport.type)) {

        message.textContent =
            "Please upload a JPG, PNG, or WEBP image.";

        message.style.color = "red";

        return;
    }


    // --------------------------------
    // FORMAT DATE OF BIRTH
    // --------------------------------

    const dateOfBirthText =
        String(day).padStart(2, "0") + "/" +
        String(month).padStart(2, "0") + "/" +
        year;


    // --------------------------------
    // READ PASSPORT
    // --------------------------------

    const reader = new FileReader();


    reader.onload = async function() {

        try {

            // --------------------------------
            // CREATE DATA OBJECT
            // --------------------------------

            const registrationData = {

                fullname:
                    document.getElementById("fullname").value,

                dateOfBirth:
                    dateOfBirthText,

                gender:
                    document.querySelector(
                        'input[name="gender"]:checked'
                    ).value,

                phone:
                    document.getElementById("phone").value,

                email:
                    document.getElementById("email").value,

                address:
                    document.getElementById("address").value,

                state:
                    document.getElementById("state").value,

                department:
                    document.getElementById("department").value,

                level:
                    document.getElementById("level").value,

                school:
                    document.getElementById("school").value,


                // PASSPORT
                passport: {

                    name: passport.name,

                    type: passport.type,

                    data: reader.result

                }

            };


            // --------------------------------
            // BUTTON
            // --------------------------------

            const submitButton =
                form.querySelector(
                    "button[type='submit']"
                );


            submitButton.disabled = true;

            submitButton.textContent =
                "Uploading...";


            message.textContent =
                "Uploading registration and passport...";

            message.style.color = "blue";


            // --------------------------------
            // SEND TO GOOGLE APPS SCRIPT
            // --------------------------------

            const response = await fetch(scriptURL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify(registrationData)

            });


            const data = await response.json();


            // --------------------------------
            // CHECK RESPONSE
            // --------------------------------

            if (data.status === "success") {

                message.textContent =
                    "Registration submitted successfully!";

                message.style.color = "green";


                // Reset form
                form.reset();


            } else {

                message.textContent =
                    "Something went wrong: " +
                    data.message;

                message.style.color = "red";

            }


            // --------------------------------
            // RESET BUTTON
            // --------------------------------

            submitButton.disabled = false;

            submitButton.textContent =
                "Register Now";


        } catch (error) {

            console.error("Error:", error);


            message.textContent =
                "Unable to submit registration. Please check your internet connection.";

            message.style.color = "red";


            const submitButton =
                form.querySelector(
                    "button[type='submit']"
                );


            submitButton.disabled = false;

            submitButton.textContent =
                "Register Now";

        }

    };


    // --------------------------------
    // READ IMAGE AS BASE64
    // --------------------------------

    reader.readAsDataURL(passport);

});
