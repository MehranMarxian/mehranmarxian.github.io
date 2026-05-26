(function () {
  const targets = Array.from(document.querySelectorAll(".gallery img, .artwork-statement img"));

  if (!targets.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Fullscreen image viewer");
  lightbox.innerHTML = [
    '<span class="image-lightbox__counter" aria-live="polite"></span>',
    '<button class="image-lightbox__button image-lightbox__close" type="button" aria-label="Close image">&times;</button>',
    '<button class="image-lightbox__button image-lightbox__prev" type="button" aria-label="Previous image">&lsaquo;</button>',
    '<img alt="" />',
    '<button class="image-lightbox__button image-lightbox__next" type="button" aria-label="Next image">&rsaquo;</button>',
    '<div class="image-lightbox__controls">',
    '<button class="image-lightbox__button image-lightbox__play" type="button">Play</button>',
    '<button class="image-lightbox__button image-lightbox__pause" type="button">Pause</button>',
    "</div>",
  ].join("");

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".image-lightbox__close");
  const prevButton = lightbox.querySelector(".image-lightbox__prev");
  const nextButton = lightbox.querySelector(".image-lightbox__next");
  const playButton = lightbox.querySelector(".image-lightbox__play");
  const pauseButton = lightbox.querySelector(".image-lightbox__pause");
  const counter = lightbox.querySelector(".image-lightbox__counter");
  let activeIndex = 0;
  let playTimer = null;

  function stopPlayback() {
    window.clearInterval(playTimer);
    playTimer = null;
  }

  function showImage(index) {
    activeIndex = (index + targets.length) % targets.length;
    const image = targets[activeIndex];
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    counter.textContent = `${activeIndex + 1} / ${targets.length}`;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    stopPlayback();
    lightbox.classList.remove("is-open");
    lightboxImage.removeAttribute("src");
    document.body.style.overflow = "";
  }

  function showNext() {
    showImage(activeIndex + 1);
  }

  function showPrevious() {
    showImage(activeIndex - 1);
  }

  targets.forEach((image, index) => {
    image.addEventListener("click", () => openLightbox(index));
  });

  closeButton.addEventListener("click", closeLightbox);
  nextButton.addEventListener("click", showNext);
  prevButton.addEventListener("click", showPrevious);

  playButton.addEventListener("click", () => {
    stopPlayback();
    playTimer = window.setInterval(showNext, 2800);
  });

  pauseButton.addEventListener("click", stopPlayback);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      showNext();
    } else if (event.key === "ArrowLeft") {
      showPrevious();
    } else if (event.key === " ") {
      event.preventDefault();
      if (playTimer) {
        stopPlayback();
      } else {
        playTimer = window.setInterval(showNext, 2800);
      }
    }
  });

  document.body.appendChild(lightbox);
})();
