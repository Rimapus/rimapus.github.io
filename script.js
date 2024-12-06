// Get the menu button and the menu (hot bar)
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

// Add an event listener to the button to toggle the menu visibility
menuButton.addEventListener("click", function() {
    menu.classList.toggle("hidden"); // Toggle the 'hidden' class on the menu
});
