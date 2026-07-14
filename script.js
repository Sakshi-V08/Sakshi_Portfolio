const filters = document.querySelectorAll('.filter-btn');
const linePath = document.getElementById('linePath');
const revenueValue = document.getElementById('revenueValue');
const customerValue = document.getElementById('customerValue');
const retentionValue = document.getElementById('retentionValue');
const chartLabel = document.getElementById('chartLabel');
const visitorCount = document.getElementById('visitorCount');

if (visitorCount) {
  const storedCount = Number(localStorage.getItem('portfolioVisitorCount') || 0);
  const newCount = storedCount + 1;
  localStorage.setItem('portfolioVisitorCount', newCount);
  visitorCount.textContent = newCount;
}

const revealItems = document.querySelectorAll('.reveal, .hero-content, .hero-visual');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => {
  item.classList.add('reveal');
  revealObserver.observe(item);
});

const dataMap = {
  Q1: {
    path: 'M20 120 C60 115, 90 95, 120 100 S190 125, 220 90 S280 60, 300 45',
    revenue: '$2.4M',
    customers: '18.2K',
    retention: '92%'
  },
  Q2: {
    path: 'M20 110 C60 100, 90 85, 120 90 S190 110, 220 78 S280 55, 300 38',
    revenue: '$2.9M',
    customers: '20.4K',
    retention: '94%'
  },
  Q3: {
    path: 'M20 125 C60 120, 90 102, 120 106 S190 116, 220 92 S280 62, 300 40',
    revenue: '$3.3M',
    customers: '22.8K',
    retention: '96%'
  }
};

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');
    const value = btn.getAttribute('data-range');
    linePath.setAttribute('d', dataMap[value].path);
    revenueValue.textContent = dataMap[value].revenue;
    customerValue.textContent = dataMap[value].customers;
    retentionValue.textContent = dataMap[value].retention;
    chartLabel.textContent = value;
  });
});

const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const nodes = Array.from({ length: 50 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4
}));

function animateNetwork() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
    if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 - dist / 1000})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
  });

  requestAnimationFrame(animateNetwork);
}

animateNetwork();
