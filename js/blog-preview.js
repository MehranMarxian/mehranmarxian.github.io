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

    function updateComparison() {
      var value = Number(range.value);
      after.style.clipPath = "inset(0 " + (100 - value) + "% 0 0)";
      line.style.left = value + "%";
    }

    range.addEventListener("input", updateComparison);
    updateComparison();
  });
})();
