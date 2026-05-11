let current = 1;
const total = 13;
let selectedMode = null; // 'printer' or 'genai'

function buildDots() {
  const bar = document.getElementById('progressBar');
  bar.innerHTML = '';
  for (let i = 1; i <= total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === current ? ' active' : i < current ? ' visited' : '');
    bar.appendChild(d);
  }
}

function updateModeContent() {
  if (!selectedMode) return;
  
  // Hide all mode content, then show only selected mode
  document.querySelectorAll('.mode-content').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.mode === selectedMode) {
      el.classList.add('active');
    }
  });
}

function updateUI() {
  document.getElementById('slideCounter').textContent =
    String(current).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
  document.getElementById('prevBtn').disabled = current === 1;
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = 'NEXT →';
  nextBtn.style.visibility = current === total ? 'hidden' : 'visible';
  const prevBtn = document.getElementById('prevBtn');
  prevBtn.style.visibility = current === 1 ? 'hidden' : 'visible';
  buildDots();
  updateModeContent();
}

function goTo(n) {
  if (n === current) return;
  // Reset to device selection if going back to slide 3
  if (n === 3) {
    selectedMode = null;
    document.querySelectorAll('.object-card').forEach(c => c.classList.remove('selected'));
  }
  const slides = document.querySelectorAll('.slide');
  slides.forEach(s => {
    s.classList.remove('active','exit');
    if (parseInt(s.dataset.slide) === n) s.classList.add('active');
    else if (parseInt(s.dataset.slide) === current) s.classList.add('exit');
  });
  current = n;
  updateUI();
  setTimeout(() => document.querySelectorAll('.slide.exit').forEach(s => s.classList.remove('exit')), 500);
}

function goNext() { if (current < total) goTo(current + 1); }
function goPrev() { if (current > 1) goTo(current - 1); }

function selectDevice(el, mode) {
  document.querySelectorAll('.object-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedMode = mode;
  updateModeContent();
  goNext(); // Navigate to slide 4
}

/* QUIZ 1 - correct: B */
function quiz1Answer(btn, key) {
  document.querySelectorAll('#quiz1Options .option-btn').forEach(b => b.disabled = true);
  const fb = document.getElementById('quiz1Feedback');
  if (key === 'B') {
    btn.classList.add('correct');
    fb.className = 'feedback-box show correct-fb';
    fb.textContent = '✓ Correct! Internet Connectivity gives the attacker a way in, and Hard Disk Storage silently holds every document they want to steal. Together they are the attack surface.';
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#quiz1Options .option-btn')[1].classList.add('correct');
    fb.className = 'feedback-box show wrong-fb';
    fb.textContent = key === 'A'
      ? '✗ The Mechanical Engine is purely physical - heat and rollers, no memory and no network. There is nothing for an attacker to capture here.'
      : '✗ The Image Sensor only reads a page in the moment of scanning. On its own it stores nothing and transmits nothing - it needs a disk and a network to become dangerous.';
  }
}

/* QUIZ 2 - correct: B */
function quiz2Answer(btn, key) {
  document.querySelectorAll('#quiz2Options .option-btn').forEach(b => b.disabled = true);
  const fb = document.getElementById('quiz2Feedback');
  if (key === 'B') {
    btn.classList.add('correct');
    fb.className = 'feedback-box show correct-fb';
    fb.textContent = '✓ Correct! The Hard Disk retains every document even after the printer is powered off and discarded. No network needed - just a $5 adapter and free software is enough to recover everything.';
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#quiz2Options .option-btn')[1].classList.add('correct');
    fb.className = 'feedback-box show wrong-fb';
    fb.textContent = key === 'A'
      ? '✗ Internet Connectivity needs the printer to be powered on and connected. Once discarded, the network is irrelevant - but the hard disk keeps all data regardless.'
      : '✗ The Mechanical Engine is all moving parts - drums, rollers, heat. It processes paper in real time but stores nothing. No data, no risk at end of life.';
  }
}

function rateLearning(item, rating) {
  const row = document.querySelector(`.star-row[data-item="${item}"]`);
  const stars = row.querySelectorAll('.star');
  stars.forEach((s, i) => s.classList.toggle('filled', i < rating));
}

/* ── Component image preview in side panel ── */
document.querySelectorAll('.option-btn[data-images]').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const panel  = document.getElementById(btn.dataset.panel);
    if (!panel) return;
    const srcs   = btn.dataset.images.split(',');
    const labels = btn.dataset.labels ? btn.dataset.labels.split(',') : srcs.map(() => '');
    panel.classList.add('active');
    panel.innerHTML = srcs.map((src, i) => `
      <div class="quiz-img-item">
        <img src="${src.trim()}" alt="${labels[i] || ''}">
        <div class="quiz-img-label">${labels[i] || ''}</div>
      </div>`).join('');
  });
  btn.addEventListener('mouseleave', () => {
    const panel = document.getElementById(btn.dataset.panel);
    if (!panel) return;
    panel.classList.remove('active');
    panel.innerHTML = '';
  });
});

document.querySelector('[data-slide="1"]').classList.add('active');
updateUI();

/* ══════════════════════════════════════════════════════════════ */
/* DRAG & DROP: Component Matching on Printer Image */
/* ══════════════════════════════════════════════════════════════ */

const CORRECT_COMPONENTS_IMAGE = {
  'Internet Connectivity': { y: [38, 199], x: [708, 980] },
  'Hard Disk Storage': { y: [228+50, 389+50], x: [708, 980] },
  'CPU': { y: [498+25, 659+25], x: [708, 980] },
  'Image Sensor': { y: [782, 944], x: [708, 980] },
  'Mechanical Engine': { y: [782, 951], x: [10, 281] }
};

const HIGHLIGHT_IMAGES = {
  'Internet Connectivity': 'images/components_highlighted/internet.png',
  'Hard Disk Storage': 'images/components_highlighted/storage.png',
  'CPU': 'images/components_highlighted/cpu.png',
  'Image Sensor': 'images/components_highlighted/sensor.png',
  'Mechanical Engine': 'images/components_highlighted/engine.png',
  // Distractors fall back to a neutral overlay
  default: 'images/components_highlighted/nothing.png',
  'GPS': 'images/components_highlighted/nothing.png',
  'Vacuum Pump': 'images/components_highlighted/nothing.png'
};

const INCORRECT_COMPONENTS = ['GPS', 'Vacuum Pump'];
const ALL_COMPONENTS_LIST = [...Object.keys(CORRECT_COMPONENTS_IMAGE), ...INCORRECT_COMPONENTS].sort(() => Math.random() - 0.5);

let gameState = {
  placedComponents: {} // { componentName: zoneIndex }
};

function setHighlight(componentName) {
  const highlightImg = document.getElementById('componentHighlight');
  if (!highlightImg) return;
  const src = HIGHLIGHT_IMAGES[componentName] || HIGHLIGHT_IMAGES.default;
  highlightImg.src = src;
  highlightImg.classList.add('show');
}

function clearHighlight() {
  const highlightImg = document.getElementById('componentHighlight');
  if (!highlightImg) return;
  highlightImg.src = HIGHLIGHT_IMAGES.default;
  highlightImg.classList.remove('show');
}

function initImageDragGame() {
  const canvas = document.getElementById('printerCanvas');
  const componentList = document.getElementById('componentList');
  const img = document.getElementById('printerBaseImage');

  if (!canvas || !componentList) return;

  // Crucial: Wait for image to have dimensions
  if (img.naturalWidth === 0) {
    img.onload = initImageDragGame; // Retry once loaded
    return;
  }

  clearHighlight();
  gameState.placedComponents = {};
  componentList.innerHTML = '';

  // Get canvas and image dimensions
  const rect = img.getBoundingClientRect();
  const imgWidth = rect.width;
  const imgHeight = rect.height;

  // Create drop zone overlays on the image
  Object.entries(CORRECT_COMPONENTS_IMAGE).forEach(([componentName, coords], zoneIdx) => {
    // Convert normalized coords (0-1000 scale) to pixel coords
    const y_min = (coords.y[0] / 1000) * imgHeight;
    const y_max = (coords.y[1] / 1000) * imgHeight;
    const x_min = (coords.x[0] / 1000) * imgWidth;
    const x_max = (coords.x[1] / 1000) * imgWidth;

    const zone = document.createElement('div');
    zone.className = 'drop-overlay';
    zone.dataset.componentName = componentName;
    zone.dataset.zoneIndex = zoneIdx;
    zone.style.top = y_min + 'px';
    zone.style.left = x_min + 'px';
    zone.style.width = (x_max - x_min) + 'px';
    zone.style.height = (y_max - y_min) + 'px';

    zone.innerHTML = `
      <div class="component-label-overlay">${componentName}</div>
    `;

    // Hover to preview the correct highlight region
    zone.addEventListener('mouseenter', () => setHighlight(componentName));
    zone.addEventListener('mouseleave', () => clearHighlight());

    // Drag events for drop zones
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('active');
    });

    zone.addEventListener('dragleave', (e) => {
      zone.classList.remove('active');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('active');
      const draggedComponentName = e.dataTransfer.getData('componentName');
      placeComponentOnZone(zone, draggedComponentName);
    });

    canvas.appendChild(zone);
  });

  // Create draggable component list sidebar
  ALL_COMPONENTS_LIST.forEach((comp) => {
    const compEl = document.createElement('div');
    compEl.className = 'placed-component';
    compEl.draggable = true;
    compEl.dataset.componentName = comp;
    compEl.innerHTML = `
      <span>${comp}</span>
    `;

    compEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('componentName', comp);
      compEl.classList.add('dragging');
      setHighlight(comp);
    });

    compEl.addEventListener('dragend', (e) => {
      compEl.classList.remove('dragging');
      clearHighlight();
    });

    componentList.appendChild(compEl);
  });
}

function placeComponentOnZone(zone, componentName) {
  const expectedComponent = zone.dataset.componentName;
  const compEl = document.querySelector(`[data-component-name="${componentName}"]`);

  // Check if it's the correct component for this zone
  if (componentName === expectedComponent) {
    // CORRECT placement
    zone.dataset.placedComponent = componentName;
    gameState.placedComponents[componentName] = zone.dataset.zoneIndex;

    // Uncover the label by removing the black overlay
    zone.classList.add('filled', 'correct');

    // Remove component from the list completely
    if (compEl) {
      compEl.remove();
    }

    // Flash green screen
    const slide = document.querySelector('[data-slide="6"].active');
    if (slide) {
      slide.classList.add('flash-success');
      setTimeout(() => slide.classList.remove('flash-success'), 600);
    }

    // Check if all components are placed
    if (Object.keys(gameState.placedComponents).length === 5) {
      const completion = document.getElementById('completionMessage');
      if (completion) {
        completion.classList.add('show');
      }
    }
  } else {
    // INCORRECT placement
    if (compEl) {
      // Keep red on the component permanently
      compEl.classList.add('error');
    }

    // Flash red screen
    const slide = document.querySelector('[data-slide="6"].active');
    if (slide) {
      slide.classList.add('flash-error');
      setTimeout(() => slide.classList.remove('flash-error'), 600);
    }
  }
}

function removeComponentFromAnywhere(event, componentName) {
  event.stopPropagation();
  const zone = document.querySelector(`[data-placed-component="${componentName}"]`);
  if (zone) {
    zone.removeAttribute('data-placed-component');
    zone.classList.remove('filled', 'correct');
  }
  delete gameState.placedComponents[componentName];
  const compEl = document.querySelector(`[data-component-name="${componentName}"]`);
  if (compEl) {
    compEl.classList.remove('placed', 'error', 'correct-placed');
    compEl.draggable = true;
    compEl.style.display = '';  // Show it again
  }

  // Hide completion message if showing
  const completion = document.getElementById('completionMessage');
  if (completion) {
    completion.classList.remove('show');
  }
}

function resetImageGame() {
  gameState.placedComponents = {};
  document.querySelectorAll('.drop-overlay').forEach(zone => {
    zone.removeAttribute('data-placed-component');
    zone.classList.remove('filled', 'correct');
  });

  clearHighlight();

  // Hide completion message
  const completion = document.getElementById('completionMessage');
  if (completion) {
    completion.classList.remove('show');
  }

  // Recreate the component list to show all components again
  const sidebardel = document.querySelector('.components-sidebar');
  if (sidebardel) {
    initImageDragGame();
  }
}

// Initialize when slide 6 is active
const observer = new MutationObserver(() => {
  const slide6 = document.querySelector('[data-slide="6"]');
  if (slide6 && slide6.classList.contains('active')) {
    if (!document.getElementById('componentList').innerHTML) {
      setTimeout(initImageDragGame, 100);
    }
  }
});

observer.observe(document.body, { attributes: true, subtree: true });
setTimeout(initImageDragGame, 500);

/* ══════════════════════════════════════════════════════════════ */
/* GENAI PERSONA DRAG & DROP */
/* ══════════════════════════════════════════════════════════════ */

let draggedPersona = null;

function initPersonaDragDrop() {
  const personaCards = document.querySelectorAll('.persona-card');
  const dropZones = document.querySelectorAll('.drop-zone');

  personaCards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedPersona = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('active');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('active');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('active');
      if (draggedPersona) {
        zone.appendChild(draggedPersona);
        draggedPersona = null;
      }
    });
  });
}

// Initialize persona drag when entering genai path
const personaObserver = new MutationObserver(() => {
  const slide6 = document.querySelector('[data-slide="6"]');
  const personaPool = document.getElementById('persona-pool');
  if (slide6 && slide6.classList.contains('active') && selectedMode === 'genai' && personaPool && personaPool.innerHTML) {
    // Small delay to ensure DOM is ready
    setTimeout(initPersonaDragDrop, 100);
  }
});

personaObserver.observe(document.body, { attributes: true, subtree: true });

/* ══════════════════════════════════════════════════════════════ */
/* GENAI QUIZ FUNCTIONS */
/* ══════════════════════════════════════════════════════════════ */

function pick(el, correct) {
  const siblings = el.parentElement.querySelectorAll('.option');
  siblings.forEach(s => s.classList.remove('correct','wrong'));
  el.classList.add(correct ? 'correct' : 'wrong');
}
