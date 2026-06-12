jQuery(document).ready(function ($) {
  var scrolling = false;
  var resizing = false;
  var imageComparisonContainers = $(".cd-image-container");

  checkPosition(imageComparisonContainers);

  $(window).on("scroll", function () {
    if (!scrolling) {
      scrolling = true;
      window.requestAnimationFrame
        ? requestAnimationFrame(function () {
            checkPosition(imageComparisonContainers);
          })
        : setTimeout(function () {
            checkPosition(imageComparisonContainers);
          }, 100);
    }
  });

  imageComparisonContainers.each(function () {
    initializeComparison($(this));
  });

  $(window).on("resize", function () {
    if (!resizing) {
      resizing = true;
      window.requestAnimationFrame
        ? requestAnimationFrame(function () {
            checkLabel(imageComparisonContainers);
          })
        : setTimeout(function () {
            checkLabel(imageComparisonContainers);
          }, 100);
    }
  });

  function initializeComparison(container) {
    var handle = container.find(".cd-handle");
    var resizeImage = container.find(".cd-resize-img");
    var originalLabel = container.find('.cd-image-label[data-type="original"]');
    var modifiedLabel = container.find('.cd-image-label[data-type="modified"]');
    var handleElement = handle.get(0);
    var activePointerId = null;

    function moveTo(clientX) {
      var bounds = container.get(0).getBoundingClientRect();
      var minimum = 10;
      var maximum = Math.max(minimum, bounds.width - 10);
      var position = Math.min(maximum, Math.max(minimum, clientX - bounds.left));
      var width = (position / bounds.width) * 100 + "%";

      handle.css("left", width);
      resizeImage.css("width", width);
      updateLabel(modifiedLabel, resizeImage, "left");
      updateLabel(originalLabel, resizeImage, "right");
    }

    handle.on("pointerdown", function (event) {
      var pointerEvent = event.originalEvent;
      activePointerId = pointerEvent.pointerId;
      handle.addClass("draggable");
      resizeImage.addClass("resizable");

      if (handleElement.setPointerCapture) {
        handleElement.setPointerCapture(activePointerId);
      }

      moveTo(pointerEvent.clientX);
      event.preventDefault();
    });

    handle.on("pointermove", function (event) {
      var pointerEvent = event.originalEvent;
      if (activePointerId !== pointerEvent.pointerId) {
        return;
      }

      moveTo(pointerEvent.clientX);
      event.preventDefault();
    });

    handle.on("pointerup pointercancel lostpointercapture", function (event) {
      var pointerEvent = event.originalEvent;
      if (
        activePointerId !== null &&
        pointerEvent.pointerId !== undefined &&
        pointerEvent.pointerId !== activePointerId
      ) {
        return;
      }

      activePointerId = null;
      handle.removeClass("draggable");
      resizeImage.removeClass("resizable");
    });
  }

  function checkPosition(containers) {
    containers.each(function () {
      var container = $(this);
      if ($(window).scrollTop() + $(window).height() * 0.5 > container.offset().top) {
        container.addClass("is-visible");
      }
    });

    scrolling = false;
  }

  function checkLabel(containers) {
    containers.each(function () {
      var container = $(this);
      updateLabel(
        container.find('.cd-image-label[data-type="modified"]'),
        container.find(".cd-resize-img"),
        "left"
      );
      updateLabel(
        container.find('.cd-image-label[data-type="original"]'),
        container.find(".cd-resize-img"),
        "right"
      );
    });

    resizing = false;
  }

  function updateLabel(label, resizeImage, position) {
    if (!label.length || !resizeImage.length) {
      return;
    }

    if (position === "left") {
      label.offset().left + label.outerWidth() <
      resizeImage.offset().left + resizeImage.outerWidth()
        ? label.removeClass("is-hidden")
        : label.addClass("is-hidden");
    } else {
      label.offset().left > resizeImage.offset().left + resizeImage.outerWidth()
        ? label.removeClass("is-hidden")
        : label.addClass("is-hidden");
    }
  }
});
