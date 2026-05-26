(function () {
  const toggles = document.querySelectorAll(".navbar-toggler[data-target]");

  toggles.forEach((toggle) => {
    const targetSelector = toggle.getAttribute("data-target");
    const menu = document.querySelector(targetSelector);

    if (!menu) {
      return;
    }

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = menu.classList.toggle("show");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-is-open", isOpen);
    });

    menu.addEventListener("click", (event) => {
      if (!event.target.closest("a")) {
        return;
      }

      menu.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-is-open");
    });
  });
})();
