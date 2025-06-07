function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    alert("Searching for: " + query);
  } else {
    alert("Please enter a search term.");
  }
}
function toggleMenu() {
  const menu = document.getElementById('menuItems');
  menu.classList.toggle('open');
}

// Optional: Close menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('menuItems');
  const icon = document.querySelector('.menu-icon');

  if (!menu.contains(event.target) && !icon.contains(event.target)) {
    menu.classList.remove('open');
  }
});
