import Swiper from 'swiper';
import { Autoplay, EffectCoverflow, Navigation, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

const initLazyLoading = () => {
  let lazyImages = document.querySelectorAll('img.js-lazy');
  const supportsNativeLazyLoad = 'loading' in HTMLImageElement.prototype;

  if (supportsNativeLazyLoad) {
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      
      // Load source from data-srcset if it exists
      const sources = img.closest('picture').querySelectorAll('source');
      sources.forEach(source => {
        if (source.dataset.srcset) {
          source.srcset = source.dataset.srcset;
        }
      });
      
      img.classList.remove('js-lazy');
    });
  } else {
    // Fallback: IntersectionObserver for older browsers
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;

            // Load source from data-srcset if it exists
            const sources = img.closest('picture').querySelectorAll('source');
            sources.forEach(source => {
              if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
              }
            });

            img.classList.remove('js-lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => {
        imageObserver.observe(img);
      });
    } else {
      // If no IntersectionObserver, load all images immediately (old browsers fallback)
      console.warn('IntersectionObserver is not supported');

      let active = false;

      const lazyLoad = () => {
        if (active === false) {
          active = true;

          setTimeout(() => {
            lazyImages.forEach((img) => {
              const isInViewport = img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0;
              const isVisible = getComputedStyle(img).display !== 'none';

              if (isInViewport && isVisible) {
                img.src = img.dataset.src; // Load image from data-src

                // Load source from data-srcset if it exists
                const sources = img.closest('picture').querySelectorAll('source');
                sources.forEach(source => {
                  if (source.dataset.srcset) {
                    source.srcset = source.dataset.srcset;
                  }
                });

                img.classList.remove('js-lazy');

                lazyImages = [...lazyImages].filter((item) => {
                  return item !== img;
                });

                if (lazyImages.length === 0) {
                  document.removeEventListener('scroll', lazyLoad);
                  window.removeEventListener('resize', lazyLoad);
                  window.removeEventListener('orientationchange', lazyLoad);
                }
              }
            });

            active = false;
          }, 200);
        }
      };

      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationchange', lazyLoad);
    }
  }
};

const initSliders = () => {
  const sliderWelcome = new Swiper('#slider-welcome', {
    modules: [Autoplay, EffectCoverflow],
    initialSlide: 1,
    slidesPerView: 1,
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    spaceBetween: -100,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 400,
      modifier: 1,
      slideShadows: false
    },
  });
  
  const sliderMentorsThumbnail = new Swiper('#slider-mentors-thumbnail', {
    spaceBetween: -30,
    slidesPerView: 5,
    freeMode: true,
    watchSlidesProgress: true,
  });
  
  const sliderMentors = new Swiper('#slider-mentors', {
    modules: [Navigation, Thumbs],
    spaceBetween: 30,
    effect: 'fade',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: sliderMentorsThumbnail,
    },
  });
};

const initMobileMenu = () => {
  const mobileMenu = document.getElementById('mobile-menu');
  const openMenuBtn = document.getElementById('menu-toggle');
  const closeMenuBtn = document.getElementById('close-menu');
  const menuLinks = mobileMenu.querySelector('ul');

  const openMenu = () => {
    mobileMenu.classList.remove('translate-x-full', 'opacity-0');
    mobileMenu.classList.add('translate-x-0', 'opacity-100');
    setTimeout(() => {
      menuLinks.classList.remove('opacity-0');
      menuLinks.classList.add('opacity-100');
    }, 300); // Se retrasa la aparición de los enlaces para que coincida con la animación del menú
  };

  const closeMenu = () => {
    mobileMenu.classList.add('translate-x-full', 'opacity-0');
    mobileMenu.classList.remove('translate-x-0', 'opacity-100');
    menuLinks.classList.add('opacity-0');
    menuLinks.classList.remove('opacity-100');
  };

  closeMenuBtn.addEventListener('click', closeMenu);
  openMenuBtn.addEventListener('click', openMenu);
};

const initToggleCollapse = () => {
  const toggles = document.querySelectorAll('.js-toggle-collapse');

  const toggleCollapse = (collapseId) => {
    const content = document.getElementById(collapseId);
    const icon = document.getElementById('icon-' + collapseId);
  
    if (content.style.maxHeight) {
      content.style.maxHeight = null; // Collapse
      icon.classList.remove('rotate-180');
    } else {
      content.style.maxHeight = content.scrollHeight + 'px'; // Expand
      icon.classList.add('rotate-180');
    }
  };
  
  toggles.forEach((toggle) => {
    const collapseId = toggle.dataset.collapseId;
    toggle.addEventListener('click', () => toggleCollapse(collapseId));
  });
};

const init = () => {
  initLazyLoading();
  initSliders();
  initMobileMenu();
  initToggleCollapse();
};

document.addEventListener('DOMContentLoaded', init);