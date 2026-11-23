
/* =========================================
   SELENA MASSAGE SPA WITH TATTOO
   BOOKING.JS
   FORMSPREE INTEGRATION
========================================= */


document.addEventListener("DOMContentLoaded", function () {

    const FORM_ENDPOINT = "https://formspree.io/f/mwlowkyz";

    const bookingForm = document.getElementById("booking-form");

    const bookingMessage = document.getElementById("booking-message");

    const submitButton = document.getElementById("booking-submit");

    const serviceCategory = document.getElementById("service-category");

    const serviceType = document.getElementById("service-type");

    const appointmentDate = document.getElementById("appointment-date");

    const paymentMethod = document.getElementById("payment-method");

    const paymentInstructions = document.getElementById("payment-instructions");


    if (!bookingForm) return;


    /* =========================================
       1. SET MINIMUM APPOINTMENT DATE
    ========================================= */

    if (appointmentDate) {

        const today = new Date();

        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        appointmentDate.min = localToday;

    }


    /* =========================================
       2. SERVICE CATEGORY SELECTION
    ========================================= */

    const services = {

        Massage: [
            "Swedish Massage",
            "Deep Tissue Massage",
            "Hot Stone Massage",
            "Aromatherapy Massage",
            "Relaxation Massage",
            "Full Body Massage"
        ],

        Tattoo: [
            "Small Tattoo",
            "Medium Tattoo",
            "Large Tattoo",
            "Custom Tattoo Design",
            "Tattoo Consultation"
        ]

    };


    if (serviceCategory && serviceType) {

        serviceCategory.addEventListener("change", function () {

            const selectedCategory = serviceCategory.value;

            serviceType.innerHTML = "";

            if (!selectedCategory || !services[selectedCategory]) {

                serviceType.disabled = true;

                serviceType.innerHTML =
                    '<option value="">Select a category first</option>';

                return;

            }


            serviceType.disabled = false;

            serviceType.innerHTML =
                '<option value="">Choose your service</option>';


            services[selectedCategory].forEach(function (service) {

                const option = document.createElement("option");

                option.value = service;

                option.textContent = service;

                serviceType.appendChild(option);

            });

        });

    }



    /* =========================================
       3. PAYMENT METHOD INSTRUCTIONS
    ========================================= */

    if (paymentMethod && paymentInstructions) {

        paymentMethod.addEventListener("change", function () {

            const selectedMethod = paymentMethod.value;

            let message = "";


            if (selectedMethod === "Bitcoin") {

                message =
                    "Bitcoin selected. Contact Selena to receive the " +
                    "verified BTC wallet address and payment instructions. " +
                    "Your booking will remain pending until payment is verified.";

            }

            else if (selectedMethod === "USDT") {

                message =
                    "USDT selected. Contact Selena to receive the verified " +
                    "USDT wallet address and supported network. Confirm the " +
                    "network before sending any funds.";

            }

            else if (selectedMethod === "Card Payment") {

                message =
                    "Card payment selected. A secure hosted checkout link " +
                    "will be provided once the card payment processor is configured. " +
                    "Do not enter your card number or security code in this form.";

            }

            else {

                message =
                    "Select a payment method to see the next steps. " +
                    "Never send payment until you receive verified payment instructions.";

            }


            paymentInstructions.querySelector("p").textContent = message;

        });

    }



    /* =========================================
       4. DISPLAY FORM MESSAGES
    ========================================= */

    function showMessage(message, type) {

        bookingMessage.textContent = message;

        bookingMessage.className = "booking-message " + type;

        bookingMessage.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }



    /* =========================================
       5. BOOKING FORM SUBMISSION
    ========================================= */

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Browser form validation

        if (!bookingForm.reportValidity()) {

            return;

        }


        // Prevent accidental past appointments

        if (appointmentDate && appointmentDate.value) {

            const selectedDate = appointmentDate.value;

            const today = new Date();

            const localToday = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");


            if (selectedDate < localToday) {

                showMessage(
                    "Please choose today or a future appointment date.",
                    "error"
                );

                return;

            }

        }


        // Honeypot spam check

        const honeypot = bookingForm.querySelector(
            'input[name="_gotcha"]'
        );

        if (honeypot && honeypot.value.trim() !== "") {

            return;

        }


        // Disable submit button while sending

        submitButton.disabled = true;

        submitButton.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Sending Booking...';


        bookingMessage.className = "booking-message";

        bookingMessage.textContent = "";


        try {

            const formData = new FormData(bookingForm);


            const response = await fetch(FORM_ENDPOINT, {

                method: "POST",

                body: formData,

                headers: {

                    "Accept": "application/json"

                }

            });


            const result = await response.json().catch(function () {

                return {};

            });


            if (response.ok) {

                showMessage(
                    "Your booking request has been submitted successfully! " +
                    "Selena will review your request and contact you. " +
                    "Your appointment and payment are not confirmed yet.",
                    "success"
                );


                bookingForm.reset();


                // Reset service selection

                if (serviceType) {

                    serviceType.disabled = true;

                    serviceType.innerHTML =
                        '<option value="">Select a category first</option>';

                }


                // Restore payment instructions

                if (paymentInstructions) {

                    paymentInstructions.querySelector("p").textContent =
                        "Select a payment method to see the next steps. " +
                        "Never send payment until you receive verified payment instructions.";

                }


            } else {

                const errorMessage = result.errors
                    ? result.errors.map(function (error) {
                        return error.message;
                    }).join(" ")
                    : "Your booking could not be submitted. Please try again.";


                showMessage(errorMessage, "error");

            }


        } catch (error) {

            console.error("Booking submission error:", error);

            showMessage(
                "Connection problem. Please check your internet connection and try again.",
                "error"
            );

        }


        // Restore submit button

        submitButton.disabled = false;

        submitButton.innerHTML =
            '<span>Submit Booking Request</span> ' +
            '<i class="fas fa-arrow-right"></i>';

    });


});

