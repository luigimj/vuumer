console.log("Main.js loaded successfully!");

const toggleCollapse = (collapseId) => {
  const content = document.getElementById(collapseId);
  const icon = document.getElementById("icon-" + collapseId);

  if (content.style.maxHeight) {
    content.style.maxHeight = null; // Collapse
    icon.classList.remove("rotate-180");
  } else {
    content.style.maxHeight = content.scrollHeight + "px"; // Expand
    icon.classList.add("rotate-180");
  }
};

const toggles = document.querySelectorAll(".js-toggle-collapse");

toggles.forEach((toggle) => {
  const collapseId = toggle.dataset.collapseId;
  toggle.addEventListener("click", () => toggleCollapse(collapseId));
});

document.addEventListener("DOMContentLoaded", () => {
  let lazyImages = document.querySelectorAll("img.js-lazy");

  // Check if native lazy loading is supported
  const supportsNativeLazyLoad = "loading" in HTMLImageElement.prototype;

  if (supportsNativeLazyLoad) {
    lazyImages.forEach((img) => {
      // Load image from data-src
      img.src = img.dataset.src;
      
      // Load source from data-srcset if it exists
      const sources = img.closest('picture').querySelectorAll('source');
      sources.forEach(source => {
        if (source.dataset.srcset) {
          source.srcset = source.dataset.srcset;
        }
      });
      
      img.classList.remove("js-lazy");
    });
  } else {
    // Fallback: IntersectionObserver for older browsers
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src; // Load image from data-src

            // Load source from data-srcset if it exists
            const sources = img.closest('picture').querySelectorAll('source');
            sources.forEach(source => {
              if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
              }
            });

            img.classList.remove("js-lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => {
        imageObserver.observe(img);
      });
    } else {
      // If no IntersectionObserver, load all images immediately (old browsers fallback)
      console.warning("IntersectionObserver is not supported");

      let active = false;

      const lazyLoad = () => {
        if (active === false) {
          active = true;

          setTimeout(() => {
            lazyImages.forEach((img) => {
              const isInViewport = img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0;
              const isVisible = getComputedStyle(img).display !== "none";

              if (isInViewport && isVisible) {
                img.src = img.dataset.src; // Load image from data-src

                // Load source from data-srcset if it exists
                const sources = img.closest('picture').querySelectorAll('source');
                sources.forEach(source => {
                  if (source.dataset.srcset) {
                    source.srcset = source.dataset.srcset;
                  }
                });

                img.classList.remove("js-lazy");

                lazyImages = [...lazyImages].filter((item) => {
                  return item !== img;
                });

                if (lazyImages.length === 0) {
                  document.removeEventListener("scroll", lazyLoad);
                  window.removeEventListener("resize", lazyLoad);
                  window.removeEventListener("orientationchange", lazyLoad);
                }
              }
            });

            active = false;
          }, 200);
        }
      };

      document.addEventListener("scroll", lazyLoad);
      window.addEventListener("resize", lazyLoad);
      window.addEventListener("orientationchange", lazyLoad);
    }
  }
});
