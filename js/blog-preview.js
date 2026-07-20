(function () {
  "use strict";

  document.querySelectorAll("[data-slideshow]").forEach(function (slideshow, slideshowIndex) {
    var slides = Array.prototype.slice.call(slideshow.querySelectorAll(".blog-card__slide"));
    var current = 0;

    if (slides.length < 2) {
      return;
    }

    window.setInterval(function () {
      slides[current].classList.remove("is-active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("is-active");
    }, 3600 + slideshowIndex * 700);
  });

  document.querySelectorAll("[data-comparison]").forEach(function (comparison) {
    var range = comparison.querySelector(".blog-card__range");
    var after = comparison.querySelector(".blog-card__comparison-after");
    var line = comparison.querySelector(".blog-card__comparison-line");

    if (!range || !after || !line) {
      return;
    }

    function updateComparison(value) {
      value = Math.max(0, Math.min(100, Number(value)));
      range.value = value;
      after.style.clipPath = "inset(0 " + (100 - value) + "% 0 0)";
      line.style.left = value + "%";
    }

    function updateFromPointer(event) {
      var rect = comparison.getBoundingClientRect();
      var x = event.clientX - rect.left;
      updateComparison((x / rect.width) * 100);
    }

    range.addEventListener("input", function () {
      updateComparison(range.value);
    });

    comparison.addEventListener("pointerdown", function (event) {
      comparison.setPointerCapture(event.pointerId);
      updateFromPointer(event);
    });

    comparison.addEventListener("pointermove", function (event) {
      if (event.buttons) {
        updateFromPointer(event);
      }
    });

    updateComparison(range.value || 50);
  });
})();
