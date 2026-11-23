
/* =========================================
   SELENA MASSAGE SPA WITH TATTOO
   APP.JS — COMPLETE VERSION
========================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       1. MOBILE NAVIGATION
    ========================================= */

    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");


    // Function to close mobile navigation

    function closeMobileMenu() {

        if (!menuToggle || !navbar) return;

        navbar.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        const menuIcon = menuToggle.querySelector("i");

        if (menuIcon) {

            menuIcon.classList.remove("fa-times");

            menuIcon.classList.add("fa-bars");

        }

    }


    // Open and close mobile navigation

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", function (event) {

            event.stopPropagation();

            navbar.classList.toggle("active");

            const isOpen = navbar.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);

            const menuIcon = menuToggle.querySelector("i");

            if (menuIcon) {

                menuIcon.classList.toggle("fa-bars", !isOpen);

                menuIcon.classList.toggle("fa-times", isOpen);

            }

        });


        // Close menu after clicking a navigation link

        const navLinks = navbar.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                closeMobileMenu();

            });

        });


        // Close menu when clicking outside

        document.addEventListener("click", function (event) {

            const clickedInsideMenu = navbar.contains(event.target);

            const clickedMenuButton = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedMenuButton) {

                closeMobileMenu();

            }

        });


        // Close menu when pressing Escape

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                closeMobileMenu();

            }

        });


        // Close menu when switching to desktop screen

        window.addEventListener("resize", function () {

            if (window.innerWidth > 768) {

                closeMobileMenu();

            }

        });

    }



    /* =========================================
       2. HERO BACKGROUND VIDEO
    ========================================= */

    const heroVideo = document.querySelector(".hero-video");


    if (heroVideo) {

        // Keep the video muted for autoplay compatibility

        heroVideo.muted = true;

        heroVideo.playsInline = true;


        // Attempt to play the background video

        const playVideo = heroVideo.play();

        if (playVideo !== undefined) {

            playVideo.catch(function () {

                console.log(
                    "Hero video autoplay was blocked. The poster image will be displayed."
                );

            });

        }


        // Hide video if the file cannot load.
        // The CSS hero background image remains as fallback.

        heroVideo.addEventListener("error", function () {

            heroVideo.style.display = "none";

            console.warn("Hero background video could not be loaded.");

        });

    }



    /* =========================================
       3. SCROLL REVEAL ANIMATIONS
    ========================================= */

    const revealElements = document.querySelectorAll(
        ".welcome-content, " +
        ".section-heading, " +
        ".service-card, " +
        ".tattoo-content, " +
        ".gallery-item, " +
        ".why-card, " +
        ".payment-card, " +
        ".contact-item, " +
        ".contact-form, " +
        ".booking-cta, " +
        ".newsletter-section"
    );


    // Add reveal class automatically

    revealElements.forEach(function (element) {

        element.classList.add("reveal");

    });


    // Check if browser supports Intersection Observer

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(

            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }

        );


        revealElements.forEach(function (element) {

            revealObserver.observe(element);

        });

    } else {

        // Fallback for older browsers

        revealElements.forEach(function (element) {

            element.classList.add("is-visible");

        });

    }



    /* =========================================
       4. STAGGERED CARD ANIMATIONS
    ========================================= */

    const cardGroups = document.querySelectorAll(
        ".services-grid, " +
        ".gallery-grid, " +
        ".why-grid, " +
        ".payment-grid"
    );


    cardGroups.forEach(function (group) {

        const cards = group.children;

        Array.from(cards).forEach(function (card, index) {

            card.style.transitionDelay = (index * 100) + "ms";

        });

    });



    /* =========================================
       5. ACTIVE NAVIGATION LINK
    ========================================= */

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const allNavLinks = document.querySelectorAll(".nav-links a");


    allNavLinks.forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (!linkPage) return;

        const cleanLink = linkPage.split("#")[0];

        if (cleanLink === currentPage) {

            link.classList.add("active");

        }

    });



    /* =========================================
       6. FOOTER COPYRIGHT YEAR
    ========================================= */

    const copyrightYear = document.getElementById("copyright-year");


    if (copyrightYear) {

        copyrightYear.textContent = new Date().getFullYear();

    }



    /* =========================================
       7. BACK TO TOP BUTTON
    ========================================= */

    const backToTop = document.getElementById("back-to-top");


    if (backToTop) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 500) {

                backToTop.classList.add("show");

            } else {

                backToTop.classList.remove("show");

            }

        });


        backToTop.addEventListener("click", function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    }



    /* =========================================
       8. CONSOLE MESSAGE
    ========================================= */

    console.log(
        "Selena Massage Spa with Tattoo website loaded successfully."
    );


});

