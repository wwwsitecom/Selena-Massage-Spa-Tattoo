
/* =========================================
   SELENA MASSAGE SPA WITH TATTOO
   APP.JS — PART 1
   MOBILE NAVIGATION MENU
========================================= */


// Wait until the HTML page has fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Get the mobile menu button
    const menuToggle = document.getElementById("menu-toggle");

    // Get the navigation menu
    const navbar = document.getElementById("navbar");


    // Check that both elements exist
    if (menuToggle && navbar) {

        // Open and close the mobile navigation
        menuToggle.addEventListener("click", function () {

            // Toggle the active class
            navbar.classList.toggle("active");

            // Check whether the menu is open
            const isOpen = navbar.classList.contains("active");

            // Update accessibility information
            menuToggle.setAttribute("aria-expanded", isOpen);

            // Change the menu icon
            const menuIcon = menuToggle.querySelector("i");

            if (menuIcon) {
                menuIcon.classList.toggle("fa-bars", !isOpen);
                menuIcon.classList.toggle("fa-times", isOpen);
            }

        });


        // Close the menu when a navigation link is clicked
        const navLinks = navbar.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navbar.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                const menuIcon = menuToggle.querySelector("i");

                if (menuIcon) {
                    menuIcon.classList.remove("fa-times");
                    menuIcon.classList.add("fa-bars");
                }

            });

        });


        // Close the menu when clicking outside it
        document.addEventListener("click", function (event) {

            const clickedInsideMenu = navbar.contains(event.target);
            const clickedMenuButton = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedMenuButton) {

                navbar.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                const menuIcon = menuToggle.querySelector("i");

                if (menuIcon) {
                    menuIcon.classList.remove("fa-times");
                    menuIcon.classList.add("fa-bars");
                }

            }

        });

    }

});

