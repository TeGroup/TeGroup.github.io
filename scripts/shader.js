let scrolled = false;
window.addEventListener('wheel', function (e) {
const hero = document.querySelector('.hero-area');

if (e.deltaY > 0 && !scrolled) {
      hero.classList.add('scrolled');
      scrolled = true;
    }
  });

