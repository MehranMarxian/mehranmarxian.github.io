/* VOID / PARTICLE MEMORY live demo loader.
   Supports multiple cards per page via the data-void-demo attribute. Each
   card declares its own demo URL; the observer swaps poster → iframe on
   visibility and removes the iframe off-screen so nothing runs in the
   background. */
(function () {
  var cards = document.querySelectorAll(".void-card[data-void-demo]");
  if (!cards.length || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;
      var f = el.querySelector("iframe");
      if (e.isIntersecting && !f) {
        f = document.createElement("iframe");
        f.title = "VOID / PARTICLE MEMORY — live demo";
        f.allow = "fullscreen";
        f.src = el.getAttribute("data-void-demo");
        el.appendChild(f);
      } else if (!e.isIntersecting && f) {
        f.remove();
      }
    });
  }, { rootMargin: "200px" });
  cards.forEach(function (c) { io.observe(c); });
})();
