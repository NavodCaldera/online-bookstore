function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    alert("Searching for: " + query);
  } else {
    alert("Please enter a search term.");
  }
}

const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval = setInterval(() => changeSlide(1), 6000); // Auto-play every 6s

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  function changeSlide(n) {
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  function goToSlide(n) {
    currentSlide = n;
    showSlide(currentSlide);
    resetAutoPlay();
  }

  function resetAutoPlay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), 6000);
  }

  // Swipe support (mobile)
  let touchStartX = 0;
  let touchEndX = 0;
  const slider = document.getElementById('slider');

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      changeSlide(1); // swipe left
      resetAutoPlay();
    } else if (touchEndX > touchStartX + 50) {
      changeSlide(-1); // swipe right
      resetAutoPlay();
    }
  }

  // Initialize
  showSlide(currentSlide);

  const swiper = new Swiper('.swiper', {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      1024: { slidesPerView: 4 },
      768: { slidesPerView: 2 },
      480: { slidesPerView: 1 }
    }
  });


