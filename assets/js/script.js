// Set year
document.getElementById('year').textContent = new Date().getFullYear();

// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  // toggle via inline style for compatibility
  if (mobileMenu.style.display === 'block') {
    mobileMenu.style.display = 'none';
  } else {
    mobileMenu.style.display = 'block';
  }
});

// Close mobile menu when link is clicked
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.style.display = 'none';
  });
});

// Smooth scroll + active nav highlight
const links = document.querySelectorAll('.nav-links a');
links.forEach(a => {
  a.addEventListener('click', (e) => {
    links.forEach(x => x.classList.remove('active'));
    a.classList.add('active');

    // close mobile menu on link click (if open)
    if (mobileMenu.style.display === 'block') {
      mobileMenu.style.display = 'none';
      hamburger.classList.remove('active');
    }
  });
});

// Active on scroll
const sections = [...document.querySelectorAll('main section, header')];
function onScroll() {
  const offset = window.scrollY + 120;
  let cur = sections[0];
  for (const s of sections) if (s.offsetTop <= offset) cur = s;
  const id = cur.id || 'home';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Navbar hide on scroll
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    navbar.classList.add('hidden');
  } else {
    // Scrolling up
    navbar.classList.remove('hidden');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}, { passive: true });

// Product Gallery
const productCards = document.querySelectorAll('.product-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');
let currentIndex = 0;
const totalProducts = productCards.length;
let isTransitioning = false;

// Create indicators
for (let i = 0; i < totalProducts; i++) {
  const indicator = document.createElement('div');
  indicator.classList.add('indicator');
  if (i === 0) indicator.classList.add('active');
  indicator.addEventListener('click', () => goToSlide(i));
  indicatorsContainer.appendChild(indicator);
}

const indicators = document.querySelectorAll('.indicator');

function updateGallery() {
  if (isTransitioning) return;
  isTransitioning = true;

  productCards.forEach((card, index) => {
    card.classList.remove('active', 'prev', 'next', 'hidden');

    if (index === currentIndex) {
      card.classList.add('active');
    } else if (index === (currentIndex - 1 + totalProducts) % totalProducts) {
      card.classList.add('prev');
    } else if (index === (currentIndex + 1) % totalProducts) {
      card.classList.add('next');
    } else {
      card.classList.add('hidden');
    }
  });

  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentIndex);
  });

  // Reset transition flag after animation completes
  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}

function goToSlide(index) {
  if (isTransitioning) return;
  currentIndex = index;
  updateGallery();
}

function nextSlide() {
  if (isTransitioning) return;
  currentIndex = (currentIndex + 1) % totalProducts;
  updateGallery();
}

function prevSlide() {
  if (isTransitioning) return;
  currentIndex = (currentIndex - 1 + totalProducts) % totalProducts;
  updateGallery();
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Click on card to make it active
productCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    goToSlide(index);
  });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

// Auto-rotate with performance optimization
let autoRotateInterval;
let isAutoRotating = true;

function startAutoRotate() {
  if (isAutoRotating) {
    autoRotateInterval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);
  }
}

function stopAutoRotate() {
  clearInterval(autoRotateInterval);
}

// Start auto-rotate
startAutoRotate();

// Pause on hover
const galleryContainer = document.querySelector('.gallery-container');
if (galleryContainer) {
  galleryContainer.addEventListener('mouseenter', () => {
    isAutoRotating = false;
    stopAutoRotate();
  });

  galleryContainer.addEventListener('mouseleave', () => {
    isAutoRotating = true;
    startAutoRotate();
  });
}

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (galleryContainer) {
  galleryContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  galleryContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    nextSlide();
  }
  if (touchEndX > touchStartX + 50) {
    prevSlide();
  }
}

// close on Esc (no modal, keep handler minimal)
document.addEventListener('keydown', (e) => {
  // placeholder if future handlers needed
});

// Keep btn-detail listeners safe (no modal)
document.querySelectorAll('.btn-detail').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.product-card');
    const title = card.querySelector('h3').textContent;
    const img = card.querySelector('img').src;
    const desc = (card.querySelector('p')) ? card.querySelector('p').textContent : '';
    // No modal: we could open checkout directly or navigate
    // If you want behavior here, tell me and I'll wire it (e.g., open form link)
  });
});
