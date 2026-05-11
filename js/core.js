let current = 1;
let total = 1;
let nextGated = false;

function lockNext()   { nextGated = true;  updateUI(); }
function unlockNext() { nextGated = false; updateUI(); }

function buildDots() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  bar.innerHTML = '';
  for (let i = 1; i <= total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === current ? ' active' : i < current ? ' visited' : '');
    bar.appendChild(d);
  }
}

function updateUI() {
  const counter = document.getElementById('slideCounter');
  if (counter) counter.textContent = String(current).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.style.visibility = current === 1 ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.style.visibility = (current === total || nextGated) ? 'hidden' : 'visible';
  buildDots();
}

function goTo(n) {
  if (n === current || n < 1 || n > total) return;
  const slides = document.querySelectorAll('.slide');
  slides.forEach(s => {
    s.classList.remove('active', 'exit');
    if (parseInt(s.dataset.slide) === n) s.classList.add('active');
    else if (parseInt(s.dataset.slide) === current) s.classList.add('exit');
  });
  current = n;
  updateUI();
  setTimeout(() => document.querySelectorAll('.slide.exit').forEach(s => s.classList.remove('exit')), 500);
}

function goNext() { goTo(current + 1); }
function goPrev() { goTo(current - 1); }

function rateLearning(item, rating) {
  const row = document.querySelector(`.star-row[data-item="${item}"]`);
  if (!row) return;
  row.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('filled', i < rating));
}

function initSlides(n) {
  total = n;
  document.querySelector('[data-slide="1"]').classList.add('active');
  updateUI();
}

/* Duolingo-style level-complete celebration lives in js/celebration.js so it
   can also be used by pages (like social_media) that don't load core.js. */
