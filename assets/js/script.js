    // Set year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Smooth scroll + active nav highlight
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(a => {
      a.addEventListener('click', (e) => {
        links.forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
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
    window.addEventListener('scroll', onScroll);
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
    galleryContainer.addEventListener('mouseenter', () => {
      isAutoRotating = false;
      stopAutoRotate();
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
      isAutoRotating = true;
      startAutoRotate();
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    galleryContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        nextSlide();
      }
      if (touchEndX > touchStartX + 50) {
        prevSlide();
      }
    }

    // Modal preview functions
    const modal = document.getElementById('previewModal');
    const previewImg = document.getElementById('previewImg');
    const previewTitle = document.getElementById('previewTitle');
    const previewDesc = document.getElementById('previewDesc');
    const previewForm = document.getElementById('previewForm');

    function openPreview(title, img, desc = '') {
      previewImg.src = img;
      previewImg.alt = title;
      previewTitle.textContent = title;
      previewDesc.textContent = desc || 'Deskripsi singkat produk. Ganti teks ini di kode.';
      previewForm.href = 'https://forms.google.com';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      previewForm.focus();
    }

    function closePreview(){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }

    // close on Esc
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && modal.classList.contains('show')) closePreview();
    });

    // Detail button click
    document.querySelectorAll('.btn-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        const title = card.querySelector('h3').textContent;
        const img = card.querySelector('img').src;
        const desc = card.querySelector('p').textContent;
        openPreview(title, img, desc);
      });
    });