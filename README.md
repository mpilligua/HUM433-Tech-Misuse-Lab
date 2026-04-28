# Tech Misuses Lab

An interactive slide-based tool that teaches students to identify misuse scenarios for everyday technologies.

## Project Structure

```
index.html           — 3-slide navigation hub (objectives, why it matters, choose a device)
styles.css           — shared styles used by all pages
js/
  core.js            — shared slide engine (navigation, dots, star ratings)
  products.json      — product registry; drives the device cards on the home screen
products/
  printer.html       — Office Printer module (10 slides)
  genai.html         — Generative AI module (10 slides)
images/              — all images and videos
```

## How to Add a New Product

### Step 1 — Register it in `js/products.json`

Open [js/products.json](js/products.json) and add an entry to the `products` array:

```json
{
  "id": "speaker",
  "name": "Smart Speaker",
  "icon": "🔊",
  "file": "products/speaker.html"
}
```

The card will appear automatically on the home screen. No changes to `index.html` needed.

### Step 2 — Create the product HTML

Create `products/speaker.html`. The easiest way is to copy an existing product file and edit its content.

Every product file follows the same template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Tech Misuses Lab — Smart Speaker</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="../styles.css"/>
</head>
<body>

<div class="topbar">
  <a class="topbar-home" href="../index.html" style="font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:2px;text-decoration:none;text-transform:uppercase;">← HOME</a>
  <div class="progress-bar" id="progressBar"></div>
  <div class="slide-counter" id="slideCounter"></div>
</div>

<div class="slides-wrapper">

  <!-- SLIDE 1 -->
  <div class="slide" data-slide="1">
    <h2>The Smart <span class="accent-word">Speaker</span></h2>
    <!-- ... your content ... -->
  </div>

  <!-- SLIDE 2 -->
  <div class="slide" data-slide="2">
    <!-- ... -->
  </div>

  <!-- Add as many slides as needed -->

</div>

<div class="bottom-nav">
  <button class="nav-btn" id="prevBtn" onclick="goPrev()">← PREV</button>
  <button class="nav-btn primary" id="nextBtn" onclick="goNext()">NEXT →</button>
</div>

<script src="../js/core.js"></script>
<script>
  // Replace 8 with however many slides you have
  initSlides(8);
</script>
</body>
</html>
```

Key rules:
- Each slide needs a `data-slide` attribute numbered from `1` upward.
- Call `initSlides(N)` where `N` is the total number of slides.
- All paths to shared assets use `../` (e.g. `../styles.css`, `../images/photo.png`).
- The last slide should include a button back to the home screen: `onclick="window.location.href='../index.html'"`.

## Slide Layout Classes

These CSS classes from `styles.css` are available in any product page:

| Class | Use |
|---|---|
| `accent-word` | Yellow highlight on a word |
| `danger-word` | Red highlight on a word |
| `purpose-box` | Yellow left-border info box |
| `quiz-layout` + `quiz-left` + `quiz-right` | Two-column quiz layout |
| `option-btn` | Answer button with correct/wrong states |
| `feedback-box show correct-fb / wrong-fb` | Quiz feedback text |
| `option` | Lighter clickable option (genai style) |
| `learning-list` + `learning-item` + `star-row` | Star-rating reflection list |
| `news-card` | White newspaper-clipping block |
| `rank-list` + `rank-item` | Draggable ranking list |
| `persona-cards` + `persona-card` | Draggable persona chips |
| `drop-zone everyday / risky` | Drop targets for persona sorting |
| `img-placeholder` | Dashed placeholder box for missing images |
| `teaser-big` | Large cinematic text |
| `body-text` | Muted body paragraph |

## Shared Functions (from `js/core.js`)

| Function | What it does |
|---|---|
| `initSlides(n)` | Must be called once; sets total slide count and shows slide 1 |
| `goNext()` | Advance one slide |
| `goPrev()` | Go back one slide |
| `goTo(n)` | Jump to a specific slide number |
| `rateLearning(item, rating)` | Fills stars for a `.star-row[data-item="N"]` |

## Running Locally

Open `index.html` in a browser. Because `index.html` fetches `js/products.json`, you need a local server if opening via `file://`:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.
