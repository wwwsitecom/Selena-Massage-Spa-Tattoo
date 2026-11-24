
/* =========================================
   SELENA MASSAGE SPA WITH TATTOO
   BOOKING.JS
   FORMSPREE + PAYMENT PROOF UPLOAD
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const FORM_ENDPOINT = "https://formspree.io/f/mwlowkyz";

    const BTC_ADDRESS =
        "bc1qqk50lap6aygnkkwxqvnyjdw7k2n0h0rjex9l0n";

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    const bookingForm = document.getElementById("booking-form");
    const bookingMessage = document.getElementById("booking-message");
    const submitButton = document.getElementById("booking-submit");

    const serviceCategory = document.getElementById("service-category");
    const serviceType = document.getElementById("service-type");
    const appointmentDate = document.getElementById("appointment-date");

    const paymentMethod = document.getElementById("payment-method");
    const paymentInstructions = document.getElementById("payment-instructions");

    const btcDetails = document.getElementById("btc-payment-details");
    const usdtDetails = document.getElementById("usdt-payment-details");
    const cardDetails = document.getElementById("card-payment-details");

    const copyBTCButton = document.getElementById("copy-btc-address");

    const paymentProof = document.getElementById("payment-proof");
    const proofPreview = document.getElementById("payment-proof-preview");
    const proofImage = document.getElementById("payment-proof-image");
    const proofName = document.getElementById("payment-proof-name");

    if (!bookingForm) return;


    /* 1. MINIMUM APPOINTMENT DATE */

    function getLocalDate() {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    }

    if (appointmentDate) {
        appointmentDate.min = getLocalDate();
    }


    /* 2. SERVICE CATEGORY */

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

            if (!services[selectedCategory]) {

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


    /* 3. PAYMENT INSTRUCTIONS */

    function updatePaymentInstructions() {

        const method = paymentMethod ? paymentMethod.value : "";

        if (btcDetails) btcDetails.hidden = true;
        if (usdtDetails) usdtDetails.hidden = true;
        if (cardDetails) cardDetails.hidden = true;

        if (!paymentInstructions) return;

        const message = paymentInstructions.querySelector("p");

        if (!method) {

            message.textContent =
                "Select a payment method to see the payment instructions.";

            return;
        }

        if (method === "Bitcoin") {

            message.textContent =
                "Bitcoin selected. Check the receiving address carefully " +
                "before sending funds. Your payment must be independently verified.";

            if (btcDetails) btcDetails.hidden = false;

        }

        else if (method === "USDT") {

            message.textContent =
                "USDT selected. Do not send funds until Selena provides " +
                "a verified wallet address and confirms the supported network.";

            if (usdtDetails) usdtDetails.hidden = false;

        }

        else if (method === "Card Payment") {

            message.textContent =
                "Card payment selected. A secure hosted checkout must be " +
                "provided by Selena. Never enter card details in this form.";

            if (cardDetails) cardDetails.hidden = false;

        }
    }

    if (paymentMethod) {
        paymentMethod.addEventListener("change", updatePaymentInstructions);
    }


    /* 4. COPY BITCOIN ADDRESS */

    if (copyBTCButton) {

        copyBTCButton.addEventListener("click", async function () {

            try {

                await navigator.clipboard.writeText(BTC_ADDRESS);

                copyBTCButton.innerHTML =
                    '<i class="fas fa-check"></i> Address Copied!';

            } catch (error) {

                window.prompt(
                    "Copy this Bitcoin address:",
                    BTC_ADDRESS
                );

            }

        });
    }


    /* 5. PAYMENT SCREENSHOT PREVIEW */

    if (paymentProof) {

        paymentProof.addEventListener("change", function () {

            const file = paymentProof.files[0];

            if (!file) {

                proofPreview.hidden = true;
                proofImage.removeAttribute("src");

                return;
            }

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {

                showMessage(
                    "Please select a JPG, PNG or WEBP image.",
                    "error"
                );

                paymentProof.value = "";
                proofPreview.hidden = true;

                return;
            }

            if (file.size > MAX_IMAGE_SIZE) {

                showMessage(
                    "Your image is too large. Please choose an image under 5 MB.",
                    "error"
                );

                paymentProof.value = "";
                proofPreview.hidden = true;

                return;
            }

            const imageURL = URL.createObjectURL(file);

            proofImage.src = imageURL;
            proofName.textContent = file.name;

            proofPreview.hidden = false;

        });
    }


    /* 6. FORM MESSAGE */

    function showMessage(message, type) {

        if (!bookingMessage) return;

        bookingMessage.textContent = message;
        bookingMessage.className = "booking-message " + type;

        bookingMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    /* 7. FORM SUBMISSION */

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!bookingForm.reportValidity()) return;

        if (
            appointmentDate &&
            appointmentDate.value &&
            appointmentDate.value < getLocalDate()
        ) {

            showMessage(
                "Please choose today or a future appointment date.",
                "error"
            );

            return;
        }

        const honeypot = bookingForm.querySelector(
            'input[name="_gotcha"]'
        );

        if (honeypot && honeypot.value.trim() !== "") return;


        // Validate screenshot again before submission.

        if (paymentProof && paymentProof.files.length > 0) {

            const file = paymentProof.files[0];

            if (
                !["image/jpeg", "image/png", "image/webp"]
                    .includes(file.type) ||
                file.size > MAX_IMAGE_SIZE
            ) {

                showMessage(
                    "Please select a valid image under 5 MB.",
                    "error"
                );

                return;
            }
        }


        submitButton.disabled = true;

        submitButton.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Sending Booking...';

        bookingMessage.textContent = "";
        bookingMessage.className = "booking-message";


        try {

            const formData = new FormData(bookingForm);

            // Keep the payment status pending.
            formData.set(
                "payment_status",
                "Pending verification"
            );

            formData.set(
                "booking_status",
                "Awaiting review"
            );

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


            if (response.ok && !result.errors) {

                showMessage(
                    "Your booking request has been submitted successfully. " +
                    "Selena will review your details and payment proof. " +
                    "Your appointment and payment are not confirmed yet.",
                    "success"
                );

                bookingForm.reset();

                if (serviceType) {

                    serviceType.disabled = true;

                    serviceType.innerHTML =
                        '<option value="">Select a category first</option>';
                }

                if (proofPreview) proofPreview.hidden = true;

                if (proofImage) proofImage.removeAttribute("src");

                updatePaymentInstructions();

                if (appointmentDate) {
                    appointmentDate.min = getLocalDate();
                }

            } else {

                const errors = result.errors
                    ? result.errors.map(function (error) {
                        return error.message;
                    }).join(" ")
                    : "";

                console.error("Formspree response:", result);

                showMessage(
                    errors ||
                    "Submission failed. Check your Formspree plan, " +
                    "file upload settings and form endpoint.",
                    "error"
                );
            }

        } catch (error) {

            console.error("Booking submission error:", error);

            showMessage(
                "Connection problem. Please check your internet connection and try again.",
                "error"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                '<span>Submit Booking Request</span> ' +
                '<i class="fas fa-arrow-right"></i>';
        }

    });


    // Initial payment instructions.
    updatePaymentInstructions();

});

