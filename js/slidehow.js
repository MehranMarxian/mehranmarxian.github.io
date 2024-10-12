<div class="slideshow">
    <img src="images/image1.jpg" alt="Image 1">
    <img src="images/image2.jpg" alt="Image 2">
    <img src="images/image3.jpg" alt="Image 3">
</div>
// JavaScript Document
let index = 0;
const images = document.querySelectorAll(".slideshow img");

function showNextImage() {
    images[index].classList.remove('visible');
    index = (index + 1) % images.length;
    images[index].classList.add('visible');
}

setInterval(showNextImage, 3000);
