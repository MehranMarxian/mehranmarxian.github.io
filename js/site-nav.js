(function () {
  const nav = document.querySelector(".site-nav");
  const toggles = document.querySelectorAll(".navbar-toggler[data-target]");

  /* ---------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------- */
  toggles.forEach((toggle) => {
    const targetSelector = toggle.getAttribute("data-target");
    const menu = document.querySelector(targetSelector);

    if (!menu) {
      return;
    }

    function setMenu(isOpen) {
      menu.classList.toggle("show", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-is-open", isOpen);

      if (nav) {
        // Keep the bar pinned while the menu is open, otherwise a scroll
        // would slide the open menu off screen.
        nav.classList.toggle("is-menu-open", isOpen);
        if (isOpen) {
          nav.classList.remove("is-hidden");
        }
      }
    }

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMenu(!menu.classList.contains("show"));
    });

    menu.addEventListener("click", (event) => {
      if (!event.target.closest("a")) {
        return;
      }
      setMenu(false);
    });
  });

  /* ---------------------------------------------------------------
     Hide the bar on scroll down, bring it back on scroll up.
     --------------------------------------------------------------- */
  if (!nav) {
    return;
  }

  const THRESHOLD = 6; // ignore sub-pixel and trackpad jitter
  const REVEAL_AT = 90; // don't start hiding until we're past the bar itself

  let lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let ticking = false;

  function apply() {
    ticking = false;

    const y = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
    const delta = y - lastY;

    // Never hide while the mobile menu is open.
    if (nav.classList.contains("is-menu-open")) {
      lastY = y;
      return;
    }

    if (Math.abs(delta) < THRESHOLD) {
      return;
    }

    if (delta > 0 && y > REVEAL_AT) {
      nav.classList.add("is-hidden"); // scrolling down
    } else if (delta < 0) {
      nav.classList.remove("is-hidden"); // scrolling up
    }

    lastY = y;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(apply);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // A keyboard user tabbing into the bar must always be able to see it.
  nav.addEventListener("focusin", () => nav.classList.remove("is-hidden"));

  // Coming back to the page (bfcache, tab switch) must never leave the bar
  // stranded off screen — reveal it and resync against the real scroll position.
  function resync() {
    lastY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
    ticking = false;
    nav.classList.remove("is-hidden");
  }

  window.addEventListener("pageshow", resync);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      resync();
    }
  });
})();
