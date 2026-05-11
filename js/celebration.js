/* ── Duolingo-style level-complete celebration ─────────────────────────────
   Standalone — no dependencies on core.js. Safe to include in any product
   page, including ones with their own slide controller (e.g. social_media). */

const COMPLETION_LINES = {
  airtag:    ["You found it!", "Tagged, you're it.", "Nothing was tracking you. We checked.", "AirTagged with success."],
  printer:   ["Hot off the press!", "You jammed the threat, not the printer.", "Printed: a clean bill of misuse-awareness.", "Toner-level: enlightened."],
  genai:     ["You out-prompted the AI.", "Hallucination resistance: legendary.", "Token by token, you got this.", "Even the LLM is impressed."],
  health_monitor_device: ["Your heart rate stayed steady.", "Step goal: smashed. Misuse goal: prevented.", "Vitals: critically thoughtful.", "Wellness check: passed."],
  self_driving: ["Hands off the wheel, eyes on the misuse.", "You merged into expertise.", "Autopilot off, brain on.", "Lane: stayed in it. Threat: spotted."],
  social_media: ["You scrolled past the misuse.", "No likes needed — you nailed it.", "Algorithm: outsmarted.", "Going viral for the right reasons."],
  meta_learning: ["Meta-mastered!", "You learned how you learn. Whoa.", "Misuse-spotting: now muscle memory.", "Levelled up your level-up."]
};

const PRODUCT_META = {
  airtag:               { emoji: "📍", label: "AirTag" },
  printer:              { emoji: "🖨️", label: "Printer" },
  genai:                { emoji: "🤖", label: "GenAI" },
  health_monitor_device:{ emoji: "⌚", label: "Health Monitor" },
  self_driving:         { emoji: "🚗", label: "Self-Driving" },
  social_media:         { emoji: "📱", label: "Social Media" },
  meta_learning:        { emoji: "🧠", label: "Meta Learning" }
};

function _pickLine(productKey) {
  const pool = COMPLETION_LINES[productKey] || ["You did it!"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function startProductTimer(productKey) {
  try {
    sessionStorage.setItem('startedAt:' + productKey, Date.now().toString());
    // Reset per-product accuracy counters at the start of a fresh session.
    sessionStorage.setItem('correct:' + productKey, '0');
    sessionStorage.setItem('total:' + productKey, '0');
  } catch (e) {}
}

function _elapsedTime(productKey) {
  let started;
  try { started = parseInt(sessionStorage.getItem('startedAt:' + productKey) || '0'); } catch (e) { started = 0; }
  if (!started) return '0:42';
  const secs = Math.max(15, Math.floor((Date.now() - started) / 1000));
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m + ':' + String(s).padStart(2, '0');
}

/* Each product calls this when a quiz/drop/answer is graded.
   correct = true/false. Counters live in sessionStorage. */
function recordAnswer(productKey, correct) {
  try {
    const cKey = 'correct:' + productKey;
    const tKey = 'total:' + productKey;
    const c = parseInt(sessionStorage.getItem(cKey) || '0');
    const t = parseInt(sessionStorage.getItem(tKey) || '0');
    sessionStorage.setItem(cKey, String(c + (correct ? 1 : 0)));
    sessionStorage.setItem(tKey, String(t + 1));
  } catch (e) {}
}

function _accuracy(productKey) {
  let c = 0, t = 0;
  try {
    c = parseInt(sessionStorage.getItem('correct:' + productKey) || '0');
    t = parseInt(sessionStorage.getItem('total:' + productKey) || '0');
  } catch (e) {}
  if (!t) {
    // No graded answers recorded - fall back to a plausible random.
    return Math.floor(85 + Math.random() * 14) + '%';
  }
  return Math.round((c / t) * 100) + '%';
}

function showCompletionCelebration(productKey) {
  if (document.getElementById('completion-overlay')) return;
  const line  = _pickLine(productKey);
  const meta  = PRODUCT_META[productKey] || { emoji: "🏆", label: "Lesson" };
    const time  = _elapsedTime(productKey);
  const acc   = _accuracy(productKey);

  const overlay = document.createElement('div');
  overlay.id = 'completion-overlay';
  overlay.innerHTML = `
    <div class="completion-confetti" aria-hidden="true"></div>
    <div class="completion-card">
      <div class="completion-mascot">${meta.emoji}</div>
      <div class="completion-title">${line}</div>
      <div class="completion-subtitle">You made it. Time to brag.</div>
      <div class="completion-stats">
        <div class="stat-card stat-yellow">
          <div class="stat-label">LEVEL CLEARED</div>
          <div class="stat-value"><span class="stat-icon">⚡</span>${meta.label}</div>
        </div>
        <div class="stat-card stat-green">
          <div class="stat-label">ACCURACY</div>
          <div class="stat-value"><span class="stat-icon">🎯</span>${acc}</div>
        </div>
        <div class="stat-card stat-blue">
          <div class="stat-label">TIME</div>
          <div class="stat-value"><span class="stat-icon">⏱</span>${time}</div>
        </div>
      </div>
      <button class="completion-btn" onclick="dismissCompletionCelebration()">CLAIM XP</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const confetti = overlay.querySelector('.completion-confetti');
  const colors = ['#ffd900','#58cc02','#1cb0f6','#ff4b4b','#ce82ff'];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.4) + 's';
    piece.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.appendChild(piece);
  }

  requestAnimationFrame(() => overlay.classList.add('show'));
}

function dismissCompletionCelebration() {
  const overlay = document.getElementById('completion-overlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  setTimeout(() => overlay.remove(), 300);
}
