const container = document.getElementById('newsContainer');
const newsData = JSON.parse(container.dataset.news);
const visibleCount = 3;
let currentIndex = 0;

// 动态创建新闻项
newsData.forEach(item => {
  const div = document.createElement('div');
  div.className = 'news-item';
  div.innerHTML = `
    <p class="date">${item.date }</p>
    <p>${item.content}</p>
    
  `;
  container.appendChild(div);
});

// 控制滑动偏移
function updatePosition() {
  const percent = -(100 / visibleCount) * currentIndex;
  container.style.transform = `translateX(${percent}%)`;
}

// 按钮事件
document.querySelector('.nav-btn.left').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updatePosition();
  }
});

document.querySelector('.nav-btn.right').addEventListener('click', () => {
  if (currentIndex + visibleCount < newsData.length) {
    currentIndex++;
    updatePosition();
  }
});

updatePosition();
