let scrolled = false;
window.addEventListener('wheel', function (e) {
const hero = document.querySelector('.hero-area');

    // 向下滚动并且只触发一次
if (e.deltaY > 0 && !scrolled) {
      hero.classList.add('scrolled');
      scrolled = true;
    }
  });

