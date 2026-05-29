(function () {
  const showcase = document.querySelector("#documentaryShowcaseImage");
  const buttons = Array.from(document.querySelectorAll(".documentary-strip__item"));

  if (!showcase || !buttons.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextImage = button.dataset.full;

      if (!nextImage) {
        return;
      }

      showcase.src = nextImage;
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  });
})();
