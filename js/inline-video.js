/* Muted looping videos used as moving pictures (heroes, cards, feature clips).

   iOS refuses to autoplay video in Low Power Mode, even muted and playsinline,
   and some browsers do the same under data or battery savers: play() rejects
   with NotAllowedError. When that happens the poster stays up as a still (the
   native play button is hidden in site.css), and the first tap, click or key
   press anywhere on the page starts the clips that are meant to be running.

   Pages call siteVideo.play(video) / siteVideo.pause(video) instead of the
   element methods, so a clip that has scrolled away or slid out of the hero is
   not restarted by that first tap. Reduced motion is the page's call: it simply
   never asks for play. */
(function () {
  "use strict";

  var managed = [];
  var listening = false;
  var GESTURES = ["touchend", "click", "keydown"];

  function track(video) {
    if (managed.indexOf(video) === -1) {
      managed.push(video);
    }
  }

  function noop() {}

  function attempt(video) {
    var playing;
    try {
      playing = video.play();
    } catch (err) {
      refuse(video);
      return;
    }
    if (playing && playing.then) {
      playing.then(
        function () {
          video.removeAttribute("data-refused");
        },
        function (err) {
          if (err && err.name === "NotAllowedError") {
            refuse(video);
          }
        }
      );
    }
  }

  function refuse(video) {
    video.setAttribute("data-refused", "");
    video.dispatchEvent(new Event("inlinevideorefused"));
    if (!listening) {
      listening = true;
      GESTURES.forEach(function (type) {
        document.addEventListener(type, unlock, { capture: true, passive: true });
      });
    }
  }

  // Inside a user gesture: start the clips that should be running, and touch
  // the rest (play then pause) so iOS lets them start later without a tap.
  function unlock() {
    GESTURES.forEach(function (type) {
      document.removeEventListener(type, unlock, { capture: true, passive: true });
    });
    listening = false;

    managed.forEach(function (video) {
      if (video.hasAttribute("data-wants-play")) {
        attempt(video);
      } else if (video.hasAttribute("data-refused")) {
        var playing = video.play();
        video.pause();
        if (playing && playing.then) {
          playing.then(function () {
            video.removeAttribute("data-refused");
          }, noop);
        }
      }
    });
  }

  window.siteVideo = {
    play: function (video) {
      track(video);
      video.setAttribute("data-wants-play", "");
      attempt(video);
    },
    pause: function (video) {
      track(video);
      video.removeAttribute("data-wants-play");
      video.pause();
    }
  };
})();
