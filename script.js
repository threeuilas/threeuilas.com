// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const body = document.body;

  // Toggle mobile menu
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');
    const hamburger = mobileMenuButton.querySelector('.hamburger');
    
    if (isOpen) {
      // Close menu
      mobileMenu.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      body.classList.remove('overflow-hidden');
      hamburger.classList.remove('active');
    } else {
      // Open menu
      mobileMenu.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      body.classList.add('overflow-hidden');
      hamburger.classList.add('active');
    }
  }

  // Event listeners
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
  }

  // Close button event listener
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', toggleMobileMenu);
  }

  // Close menu when clicking on menu items
  const mobileMenuItems = document.querySelectorAll('#mobile-menu a');
  mobileMenuItems.forEach(item => {
    item.addEventListener('click', toggleMobileMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
