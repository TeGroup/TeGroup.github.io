document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("gallerySlider");
  const rawImages = JSON.parse(slider.dataset.images);
  const images = [...rawImages];
  let currentIndex = 1;

  const firstClone = document.createElement("img");
  firstClone.src = images[0];
  firstClone.classList.add("clone");

  const lastClone = document.createElement("img");
  lastClone.src = images[images.length - 1];
  lastClone.classList.add("clone");

  slider.appendChild(firstClone);
  slider.prepend(lastClone);

  images.unshift(images[images.length - 1]);
  images.push(images[1]);

  slider.innerHTML = '';
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    slider.appendChild(img);
  });

  const total = images.length;

  const slideTo = (index, withTransition = true) => {
    if (!withTransition) {
      slider.style.transition = "none";
    } else {
      slider.style.transition = "transform 0.5s ease-in-out";
    }
    slider.style.transform = `translateX(-${index * 100}%)`;
  };

  slideTo(currentIndex);

  const nextSlide = () => {
    currentIndex++;
    slideTo(currentIndex);
    setTimeout(() => {
      if (currentIndex === total - 1) {
        currentIndex = 1;
        slideTo(currentIndex, false);
      }
    }, 500);
  };

  const prevSlide = () => {
    currentIndex--;
    slideTo(currentIndex);
    setTimeout(() => {
      if (currentIndex === 0) {
        currentIndex = total - 2;
        slideTo(currentIndex, false);
      }
    }, 500);
  };

  let autoSlide = setInterval(nextSlide, 10000);

  document.querySelector(".gallery-btn.left").addEventListener("click", () => {
    prevSlide();
    resetAuto();
  });

  document.querySelector(".gallery-btn.right").addEventListener("click", () => {
    nextSlide();
    resetAuto();
  });

  function resetAuto() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 10000);
  }
});
