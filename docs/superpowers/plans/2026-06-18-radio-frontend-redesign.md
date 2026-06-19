# Radio Front-End Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the wedding site into the antique-radio aesthetic from the mockups — wood-cabinet shell, brass tuning-dial nav (desktop) / knob-menu (mobile), art-deco parchment cards for gate + RSVP, engagement photos on home.

**Architecture:** Static, no-build, non-SPA. Each page stays a separate HTML doc. Shared chrome (title + dial/knob nav) is injected by a script on every in-app page, exactly like today's `site.js`. Stations are real `<a>` links; the knob and the already-enabled cross-document View Transitions are progressive enhancement that make real navigations feel like continuous tuning. The knob/needle re-syncs to the current page on load.

**Tech Stack:** Hand-written HTML/CSS/vanilla JS. `rsvg-convert` + `cwebp` + `avifenc` for asset processing (already used). No framework, no bundler, no package.json. `node` (no project dep) for one-off logic assertions.

## Global Constraints

- **No build step, no dependencies, no framework, no package.json.** Edit files directly. (CLAUDE.md)
- **Non-SPA.** Separate HTML documents; navigation is real `location` changes.
- **Preserve unchanged:** the localStorage gate flow, the `site.js` → `#site-nav` injection pattern, and the RSVP API contract (POST login / GUESTS / PUT). API URL: `https://script.google.com/macros/s/AKfycbwfXZMR_HIAoBzBZaS6bpmgB-pNZRkrjxRn6Bq09__brkhYBJNZUaGrMnPYkYDDoqdiqQ/exec`.
- **Absolute root-relative asset paths** (`/styles/...`, `/images/...`).
- **Browser support:** Baseline Widely Available used freely; Newly/limited features (View Transitions) only as graceful progressive enhancement, no polyfills. (CLAUDE.md)
- **RSVP deadline copy, verbatim:** `September 26, 2026`.
- **Canonical station order:** `HOME, RSVP, SCHEDULE, TRAVEL, FAQ` (matches the mobile selector top→bottom).
- **No test framework.** Pure-logic functions are verified with a throwaway `node` assert script under `/tmp`; visual/interaction work is verified manually in the browser against the mockup renders in `/tmp/wedding_mock/*.png` (regenerate with `rsvg-convert -w 1000 new_design/assets_and_mockups/<f>.svg -o /tmp/wedding_mock/<f>.png`).
- **Reference mockups (gitignored, never shipped):** `new_design/assets_and_mockups/`.

---

## File Structure

**Created:**
- `images/knob.svg` — brass tuning knob (desktop rotate + mobile MENU button).
- `images/needle.svg` — red desktop dial needle/line.
- `images/menu-arrow.svg` — red mobile current-station arrow.
- `images/deco-frame.svg` — reusable art-deco card border.
- `images/home-desktop.avif` / `.webp`, `images/home-mobile.avif` / `.webp` — optimized engagement photos.
- `styles/card.css` — reusable deco parchment card component.
- `radio-math.js` — pure, DOM-free tuning math (`angleFromStation`/`stationFromAngle`/`angleFromPointer`); imported by `radio-nav.js`, tested directly by node.
- `radio-nav.js` — the dial/knob nav component (rotate desktop / tap mobile / sync-on-load / navigate); ES module that imports `radio-math.js`. Has no top-level node entry (browser-only DOM code).
- `rsvp/party.js` — pure, DOM-free party matching (`partiesByLastName`/`labelForParty`); imported by `rsvp/index.js`, tested directly by node.

**Modified:**
- `styles/root.css` — background gradient, brass title, `view-transition-name` on chrome, `@import "card.css"`.
- `styles/nav.css` — replaced with dial + knob-menu styling.
- `site.js` — keep `syncInvalid`; remove the old `renderNav` (superseded by `radio-nav.js`).
- `index.html` + `styles.css` — gate deco card.
- `home/index.html` + `home/styles.css` — chrome + responsive `<picture>` photos.
- `rsvp/index.html` + `rsvp/index.js` + `rsvp/styles.css` — 3-step deco styling + multi-party picker.
- `schedule/`, `travel/`, `faq/` `index.html` + `styles.css` — chrome + deco card.
- Each in-app page: add `<script src="/radio-nav.js">` alongside `/site.js`.

---

## Stage 1 — Asset prep

### Task 1: Extract SVG sub-assets

**Files:**
- Create: `images/knob.svg`, `images/needle.svg`, `images/menu-arrow.svg`, `images/deco-frame.svg`

**Interfaces:**
- Produces: four standalone SVGs referenced by `nav.css` (`knob.svg`, `needle.svg`, `menu-arrow.svg`) and `card.css` (`deco-frame.svg`).

- [ ] **Step 1: Inspect the source SVGs for the sub-asset group ids/coordinates**

Run: `rsvg-convert -w 1000 new_design/assets_and_mockups/knob_menu_notch.svg -o /tmp/wedding_mock/knob_menu_notch.png` and open it; open `knob_menu_notch.svg` and `updated_vertical_menu.svg` in an editor to find the `<g>`/path ids for the knob, the MENU arrow/notch, and (in the rsvp/password SVGs) the deco frame.

- [ ] **Step 2: Extract the knob**

Copy the knob `<g>` (brass dial, ridged rim, highlight) from `knob_menu_notch.svg` into a new `images/knob.svg` with its own `viewBox` tight to the knob bounds and `xmlns="http://www.w3.org/2000/svg"`. Strip surrounding text/menu elements.

- [ ] **Step 3: Extract needle (desktop) and arrow (mobile)**

`images/needle.svg` — the red vertical line/indicator from `full_page_updated_with_knob_desktop.svg`. `images/menu-arrow.svg` — the red triangle arrow from `updated_vertical_menu.svg` / `knob_menu_notch.svg`. Each tight `viewBox`, red fill preserved.

- [ ] **Step 4: Extract the deco frame**

From `password_page.svg` copy the double-line border + four corner flourishes into `images/deco-frame.svg`, sized as a 4-corner/edge frame usable via `border-image` (square-ish viewBox, transparent center).

- [ ] **Step 5: Verify each renders standalone**

Run: `for f in knob needle menu-arrow deco-frame; do rsvg-convert -w 300 images/$f.svg -o /tmp/wedding_mock/extract-$f.png && echo "ok $f"; done`
Open each PNG; confirm it shows only the intended asset, no clipping, correct colors.

- [ ] **Step 6: Commit**

```bash
git add images/knob.svg images/needle.svg images/menu-arrow.svg images/deco-frame.svg
git commit -m "Extract radio nav + deco-frame SVG sub-assets from mockups"
```

### Task 2: Optimize home photos

**Files:**
- Create: `images/home-desktop.avif`, `images/home-desktop.webp`, `images/home-mobile.avif`, `images/home-mobile.webp`

**Interfaces:**
- Produces: responsive photo set consumed by `home/index.html` `<picture>`.

- [ ] **Step 1: Generate desktop (landscape, from -98) and mobile (portrait, from -96)**

```bash
cd /Users/andrewstanish/Projects/www.andysamwedding.com
SRC=new_design/assets_and_mockups
magick "$SRC/Sam+Andy-ES-11.16.25-98.jpg" -resize 1600x -strip /tmp/home-d.png
magick "$SRC/Sam+Andy-ES-11.16.25-96.jpg" -resize 900x  -strip /tmp/home-m.png
cwebp -q 82 /tmp/home-d.png -o images/home-desktop.webp
cwebp -q 82 /tmp/home-m.png -o images/home-mobile.webp
avifenc -q 60 -s 4 /tmp/home-d.png images/home-desktop.avif
avifenc -q 60 -s 4 /tmp/home-m.png images/home-mobile.avif
```

- [ ] **Step 2: Verify dimensions and weight**

Run: `identify -format "%f %wx%h %B bytes\n" images/home-desktop.* images/home-mobile.*`
Expected: desktop ~1600px wide landscape, mobile ~900px wide portrait, each file well under ~300 KB. Note the desktop `width`/`height` for Task 11.

- [ ] **Step 3: Commit**

```bash
git add images/home-desktop.* images/home-mobile.*
git commit -m "Add optimized responsive engagement photos for home"
```

### Task 3: Wire fonts

**Files:**
- Create (conditional): `styles/contralto-light.css`, `styles/contralto-demibold.css`, `styles/contralto-bolditalic.css`
- Modify: `styles/root.css` (add `@import`s)

**Interfaces:**
- Produces: `font-family` names `contralto` (existing), and — if sourced — `contralto-light`, `contralto-demibold`, `contralto-bolditalic`, used by `card.css`/page styles.

- [ ] **Step 1: Resolve the Contralto weights open item**

Check `new_design/` and ask whether the Contralto Light/DemiBold/BoldItalic woff2 files exist. 
- **If files exist:** place them in `fonts/`, create one `@font-face` CSS per weight following the existing `styles/contralto.css` pattern (set `font-weight`/`font-style` to match, `font-display: swap`), and `@import` them in `root.css`.
- **If not:** skip the new files; the forms will use the single `contralto` family with CSS `font-weight`/`font-style`. Record the approximation in the spec's Open Items.

- [ ] **Step 2: Verify the existing display fonts are registered**

Run: `grep -l "@font-face" styles/nickerbocker.css styles/lucian-schoenschrift.css styles/contralto.css`
Expected: all three listed. These cover dial labels (Nickerbocker), title (lucian), and form body (Contralto).

- [ ] **Step 3: Commit (only if files were added)**

```bash
git add styles/contralto-*.css fonts/ styles/root.css
git commit -m "Wire Contralto display weights for form text"
```

---

## Stage 2 — Shell foundation

### Task 4: Background gradient + brass title

**Files:**
- Modify: `styles/root.css`

**Interfaces:**
- Produces: `body` background with wood + top→black gradient; `h1` brass-gradient title style reused on every page.

- [ ] **Step 1: Layer the gradient over the wood background**

In `styles/root.css` `body` rule, prepend a gradient to the existing `image-set()` declarations (gradient first so it paints on top):

```css
body {
    background-image:
        linear-gradient(to bottom, transparent 0%, transparent 35%, #000 100%),
        url("/images/wood-desktop.webp"); /* fallback */
    background-image:
        linear-gradient(to bottom, transparent 0%, transparent 35%, #000 100%),
        image-set(
            url("/images/wood-desktop.avif") type("image/avif"),
            url("/images/wood-desktop.webp") type("image/webp")
        );
}
```
Apply the same gradient prepend to the `@media (max-width:700px)` mobile background block.

- [ ] **Step 2: Brass-gradient title**

In `root.css` `h1` rule add:

```css
h1 {
    background: linear-gradient(180deg, var(--brass) 0%, var(--brass-dark) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
```

- [ ] **Step 3: Verify against mockup**

Run: `python3 -m http.server 8000` and open `http://localhost:8000/home/`. Compare to `/tmp/wedding_mock/full_page_updated_with_knob_desktop.png`: wood fades to black toward the bottom; title renders in brass gradient (not flat brass). Resize below 700px to confirm mobile gradient.

- [ ] **Step 4: Commit**

```bash
git add styles/root.css
git commit -m "Add wood->black background gradient and brass-gradient title"
```

### Task 5: Render dial (desktop) + knob-menu (mobile) markup

**Files:**
- Create: `radio-nav.js`
- Modify: `styles/nav.css` (replace contents), `site.js` (remove `renderNav` + its call), each in-app page HTML (add `<script src="/radio-nav.js">`)

**Interfaces:**
- Consumes: `#site-nav` container div (already in every in-app page).
- Produces: `window` globals none; `radio-nav.js` self-invokes. DOM contract: builds `#radio` with `.station` `<a>` links (one per NAV entry, `data-index`), a `#needle` (desktop), a `#knob` button, and `#station-menu` (mobile list). Exposes `NAV` order and a `currentIndex()` for Task 6 via module-scoped functions in the same file.

- [ ] **Step 1: Move nav rendering out of site.js**

In `site.js` delete the `NAV` array, `renderNav` function, and the `renderNav()` call (keep `syncInvalid` + its listeners). 

- [ ] **Step 2: Write `radio-nav.js` markup renderer**

```js
const NAV = [
    ['HOME', '/home/'],
    ['RSVP', '/rsvp/'],
    ['SCHEDULE', '/schedule/'],
    ['TRAVEL', '/travel/'],
    ['FAQ', '/faq/'],
]

function currentIndex() {
    const here = location.pathname
    const i = NAV.findIndex(([, href]) => here === href || here === href.slice(0, -1))
    return i < 0 ? 0 : i
}

function render() {
    const stations = NAV.map(([label, href], i) =>
        `<a class="station" data-index="${i}" href="${href}">${label}</a>`).join('')
    document.getElementById('site-nav').innerHTML = `
        <div id="radio">
            <button id="knob" type="button" aria-label="Tuning knob"></button>
            <div id="dial">
                <div id="needle" aria-hidden="true"></div>
                <div id="stations">${stations}</div>
            </div>
            <div id="station-menu" hidden>${stations}</div>
        </div>`
    markCurrent()
}

function markCurrent() {
    const i = currentIndex()
    document.querySelectorAll('.station').forEach(a =>
        a.classList.toggle('active', Number(a.dataset.index) === i))
}

render()
```

- [ ] **Step 3: Replace `styles/nav.css` with dial + knob-menu structure**

Reproduce the dial geometry by tracing `full_page_updated_with_knob_desktop.svg` (station x-positions along the brass plaque) and `updated_vertical_menu.svg` (mobile vertical list). Skeleton:

```css
#radio { display: flex; align-items: center; gap: 1rem; justify-content: center; margin: 1vh auto 2vh; }
#knob { width: 4rem; height: 4rem; border: none; background: url("/images/knob.svg") center/contain no-repeat; cursor: grab; }
#dial { position: relative; /* brass plaque bg traced from desktop SVG */ }
#stations { display: flex; gap: clamp(0.8rem, 3vw, 2.5rem); }
.station { font-family: nickerbocker, serif; text-decoration: none; color: var(--ink); }
.station.active { /* desktop: under needle; mobile: red arrow */ }
#needle { position: absolute; width: 2px; background: url("/images/needle.svg") center/contain no-repeat; /* moved by Task 6 */ }
#station-menu { display: none; }

@media (max-width: 700px) {
    #dial { display: none; }                 /* hide horizontal dial */
    #knob { /* becomes MENU button; show "MENU" label via ::after or knob.svg already includes it */ }
    #station-menu { display: none; flex-direction: column; /* vertical selector styling from updated_vertical_menu.svg */ }
    #station-menu.open { display: flex; }
    #station-menu .station.active::before { content: url("/images/menu-arrow.svg"); /* red arrow */ }
}
```

- [ ] **Step 4: Add the script tag to every in-app page**

In `home/index.html`, `rsvp/index.html`, `schedule/index.html`, `travel/index.html`, `faq/index.html`, add `<script type="module" src="/radio-nav.js"></script>` immediately after the existing `<script src="/site.js"></script>`. It is a **module** because Task 6 makes it `import` from `/radio-math.js`; module scripts are deferred, so `#site-nav` is parsed before `render()` runs.

- [ ] **Step 5: Verify static nav renders + current-page highlight**

Reload `http://localhost:8000/home/` and `/schedule/`. Confirm: desktop shows the brass dial with five stations and the knob; the current page's station is marked active and the needle sits over it; at <700px the dial hides and the knob shows as MENU. Compare to both mockup PNGs.

- [ ] **Step 6: Commit**

```bash
git add radio-nav.js styles/nav.css site.js home/index.html rsvp/index.html schedule/index.html travel/index.html faq/index.html
git commit -m "Render radio dial (desktop) + knob-menu (mobile) nav markup"
```

### Task 6: Knob interaction + navigation

**Files:**
- Create: `radio-math.js`
- Modify: `radio-nav.js`
- Test: `/tmp/knob-test.mjs` (throwaway node assertions)

**Interfaces:**
- Consumes: `NAV`, `currentIndex()` from Task 5 (in `radio-nav.js`).
- Produces: `radio-math.js` exports pure functions `angleFromStation(i, n)`, `stationFromAngle(deg, n)`, `angleFromPointer(cx, cy, px, py)`. `radio-nav.js` imports them; behavior: desktop drag rotates `#knob`/moves `#needle` and navigates on release; mobile tap toggles `#station-menu`; both call `go(href)`.

- [ ] **Step 1: Write the failing logic test**

Create `/tmp/knob-test.mjs`:

```js
import assert from 'node:assert'
import { angleFromStation, stationFromAngle } from '/Users/andrewstanish/Projects/www.andysamwedding.com/radio-math.js'

// 5 stations across a 270deg sweep (-135..+135)
assert.strictEqual(angleFromStation(0, 5), -135)
assert.strictEqual(angleFromStation(4, 5), 135)
assert.strictEqual(angleFromStation(2, 5), 0)
assert.strictEqual(stationFromAngle(-135, 5), 0)
assert.strictEqual(stationFromAngle(135, 5), 4)
assert.strictEqual(stationFromAngle(10, 5), 2)   // nearest snap
assert.strictEqual(stationFromAngle(999, 5), 4)  // clamp
console.log('knob math ok')
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node /tmp/knob-test.mjs`
Expected: FAIL — cannot find module `radio-math.js`.

- [ ] **Step 3a: Create the pure math module `radio-math.js`**

```js
const SWEEP = 270, HALF = SWEEP / 2

export function angleFromStation(i, n) { return -HALF + (SWEEP * i) / (n - 1) }
export function stationFromAngle(deg, n) {
    const clamped = Math.max(-HALF, Math.min(HALF, deg))
    return Math.round(((clamped + HALF) / SWEEP) * (n - 1))
}
export function angleFromPointer(cx, cy, px, py) {
    return Math.atan2(py - cy, px - cx) * 180 / Math.PI
}
```

This module is DOM-free, so node imports it without a DOM and the browser imports it from `radio-nav.js`.

- [ ] **Step 3b: Add behavior to `radio-nav.js`**

At the top of `radio-nav.js` add the import, then the behavior (no `export` here — `radio-nav.js` is browser-only and never imported by node):

```js
import { angleFromStation, stationFromAngle, angleFromPointer } from './radio-math.js'

function go(href) { if (href !== location.pathname) location.href = href }

function setNeedle(i) {
    const knob = document.getElementById('knob')
    const needle = document.getElementById('needle')
    if (knob) knob.style.transform = `rotate(${angleFromStation(i, NAV.length)}deg)`
    const active = document.querySelector(`.station[data-index="${i}"]`)
    if (needle && active) needle.style.left = `${active.offsetLeft + active.offsetWidth / 2}px`
}

function initDesktopKnob() {
    const knob = document.getElementById('knob')
    if (!knob) return
    let dragging = false, target = currentIndex()
    setNeedle(target)
    const onMove = e => {
        if (!dragging) return
        const r = knob.getBoundingClientRect()
        const deg = angleFromPointer(r.left + r.width / 2, r.top + r.height / 2, e.clientX, e.clientY)
        target = stationFromAngle(deg, NAV.length)
        setNeedle(target)
    }
    knob.addEventListener('pointerdown', e => { dragging = true; knob.setPointerCapture(e.pointerId) })
    knob.addEventListener('pointermove', onMove)
    knob.addEventListener('pointerup', () => { dragging = false; go(NAV[target][1]) })
}

function initMobileKnob() {
    const knob = document.getElementById('knob')
    const menu = document.getElementById('station-menu')
    if (!knob || !menu) return
    knob.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 700px)').matches) menu.classList.toggle('open')
    })
}

initDesktopKnob()
initMobileKnob()
```

Guard: in `initDesktopKnob`, only bind drag when `!matchMedia('(max-width:700px)').matches` so mobile click isn't hijacked by drag — wrap the `pointerdown` body in that check.

- [ ] **Step 4: Run the logic test to verify it passes**

Run: `node /tmp/knob-test.mjs`
Expected: `knob math ok`

- [ ] **Step 5: Browser-verify interaction**

Reload `/home/` on desktop: drag the knob — needle tracks to the nearest station and the knob rotates; release over RSVP → navigates to `/rsvp/` with a View Transition; clicking a station label also navigates. At <700px: knob is a MENU button, tap toggles the vertical menu, station tap navigates, knob does not rotate.

- [ ] **Step 6: Commit**

```bash
git add radio-math.js radio-nav.js
git commit -m "Add knob tuning interaction: drag-to-navigate + mobile menu toggle"
```

### Task 7: View Transitions persistent chrome

**Files:**
- Modify: `styles/root.css`

**Interfaces:**
- Consumes: the `#radio`/`h1` chrome from Tasks 4–6.
- Produces: `view-transition-name` on persistent chrome so it morphs in place across navigations.

- [ ] **Step 1: Name the persistent elements**

In `root.css` (inside the existing `@media (prefers-reduced-motion: no-preference)` is not required for naming; add at top level):

```css
h1 { view-transition-name: site-title; }
#radio { view-transition-name: site-radio; }
```
(`@view-transition { navigation: auto }` already exists from the earlier modern-web pass.)

- [ ] **Step 2: Verify continuity**

Navigate HOME→SCHEDULE→FAQ by clicking stations and by knob. In a Chromium browser the title + dial stay put (morph) while only the screen content cross-fades. In Firefox it falls back to instant nav with no error. Toggle OS reduced-motion → transitions disabled, nav still works.

- [ ] **Step 3: Commit**

```bash
git add styles/root.css
git commit -m "Persist radio chrome across navigations via view-transition-name"
```

---

## Stage 3 — Gate

### Task 8: Restyle gate as deco card

**Files:**
- Create: `styles/card.css`
- Modify: `styles/root.css` (`@import "card.css"`), `index.html`, `styles.css`

**Interfaces:**
- Produces: `.deco-card` class (parchment bg, `deco-frame.svg` border, Contralto text) reused by RSVP + content pages.

- [ ] **Step 1: Build the reusable card component**

`styles/card.css`:

```css
.deco-card {
    background-color: #f0e6d2;
    color: #2a1a14;
    border: 28px solid transparent;
    border-image: url("/images/deco-frame.svg") 28 round;
    padding: clamp(1rem, 4vw, 3rem);
    max-width: 50rem;
    margin: 2vh auto;
    font-family: contralto, serif;
    text-align: center;
}
.deco-card input {
    background: transparent; border: none; border-bottom: 1px solid #2a1a14;
    color: #2a1a14; font-family: contralto, serif; text-align: center;
}
.deco-card button[type="submit"] {
    background: none; border: none; font-family: contralto, serif;
    font-size: 1.2em; cursor: pointer; color: #2a1a14;
}
```
Add `@import "card.css";` to `styles/root.css` after the other imports.

- [ ] **Step 2: Restyle the gate markup**

In `index.html`, wrap the form in `<main class="deco-card">`, set the prompt text to "Please enter the last name of the bride or groom." and the button text to "submit". In `styles.css` remove the old password-input rules now covered by `.deco-card` (keep only gate-specific overrides). Real HTML text resolves the mockup's kerning artifact; add `letter-spacing` only if needed to match `password_page.svg`.

- [ ] **Step 3: Verify against mockup**

Open `http://localhost:8000/`. Compare to `/tmp/wedding_mock/password_page.png`: parchment card, deco border + corners, centered prompt with clean kerning, underlined input, "submit". Confirm the gate still submits (network call fires).

- [ ] **Step 4: Commit**

```bash
git add styles/card.css styles/root.css index.html styles.css
git commit -m "Restyle gate as art-deco parchment card; add reusable .deco-card"
```

---

## Stage 4 — RSVP

### Task 9: Multi-party picker logic

**Files:**
- Create: `rsvp/party.js`
- Modify: `rsvp/index.js`, `rsvp/index.html`
- Test: `/tmp/party-test.mjs`

**Interfaces:**
- Consumes: the guest map shape `{ [groupId]: [{first,last,slot}] }` (existing).
- Produces: `rsvp/party.js` exports `partiesByLastName(guests, last)` → `[{id, members}]` (all groups with a non-slot member matching `last`) and `labelForParty(members)` → first-names string like `"Maria & John"`. `rsvp/index.js` imports them.

- [ ] **Step 1: Write the failing test**

`/tmp/party-test.mjs`:

```js
import assert from 'node:assert'
import { partiesByLastName, labelForParty } from '/Users/andrewstanish/Projects/www.andysamwedding.com/rsvp/party.js'

const guests = {
  afam1: [{first:'Maria',last:'Stanish',slot:false},{first:'John',last:'Stanish',slot:false}],
  bfam2: [{first:'Robert',last:'Stanish',slot:false}],
  cfam3: [{first:'Lara',last:'Quinn',slot:false}],
}
const m = partiesByLastName(guests, 'stanish')
assert.strictEqual(m.length, 2)
assert.deepStrictEqual(m.map(g => g.id).sort(), ['afam1','bfam2'])
assert.strictEqual(labelForParty(guests.afam1), 'Maria & John')
assert.strictEqual(partiesByLastName(guests, 'quinn').length, 1)
console.log('party logic ok')
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node /tmp/party-test.mjs` → FAIL (cannot find module `rsvp/party.js`).

- [ ] **Step 3a: Create the pure module `rsvp/party.js`**

```js
export function partiesByLastName(guests, last) {
    const l = (last || '').trim().toLowerCase()
    return Object.entries(guests)
        .filter(([, members]) => members.some(m => !m.slot && (m.last || '').trim().toLowerCase() === l))
        .map(([id, members]) => ({ id, members }))
}
export function labelForParty(members) {
    return members.filter(m => !m.slot).map(m => m.first).join(' & ')
}
```

- [ ] **Step 3b: Make `rsvp/index.js` a module that imports it**

In `rsvp/index.html` change the tag to `<script type="module" src="/rsvp/index.js"></script>` (module scope is fine — nothing external references its top-level vars; deferred timing means the DOM is ready when its listeners attach). At the top of `rsvp/index.js` add:

```js
import { partiesByLastName, labelForParty } from './party.js'
```

- [ ] **Step 4: Wire the picker step into the find-party flow**

Between the name form and the party form, when `partiesByLastName` returns >1, render selectable cards (one `<button class="party-pick">` per party, text = `labelForParty(members)`), each setting `matchedGroup` to that party on click and advancing to the RSVP form; when exactly 1, advance directly; when 0, show the existing not-found error. Reuse the existing `renderParty`/submit logic unchanged.

- [ ] **Step 5: Run the test to verify it passes**

Run: `node /tmp/party-test.mjs` → `party logic ok`

- [ ] **Step 6: Browser-verify**

On `/rsvp/`, enter `Stanish` (seed two Stanish parties if needed via the live guest data) → picker cards appear → choosing one shows that party's RSVP form. A unique last name skips the picker.

- [ ] **Step 7: Commit**

```bash
git add rsvp/party.js rsvp/index.js rsvp/index.html
git commit -m "RSVP: party picker for duplicate last names (closes nq7u)"
```

### Task 10: Restyle the three RSVP steps

**Files:**
- Modify: `rsvp/index.html`, `rsvp/styles.css`

**Interfaces:**
- Consumes: `.deco-card` (Task 8); the step structure `#step-name`/`#step-party`/`#step-thanks` + the new picker container.

- [ ] **Step 1: Apply deco cards + mockup copy**

Wrap each step section in `.deco-card`. Step 1 copy: the intro paragraph + "RSVP deadline is September 26, 2026." + last-name field + "continue". Step 2: "RSVP" heading, per-member name with **attending / not attending** controls (radio inputs styled as the deco checkboxes; label text exactly "attending" / "not attending"), "Guest:" fill-in line. Step 3: "Thank you for your RSVP! If you need to change your response, the deadline to do so is September 26, 2026."

- [ ] **Step 2: Style the checkboxes/labels to match the mockup**

In `rsvp/styles.css` style the attending/not-attending controls and member layout per `rsvp_page_2.svg` (square deco boxes, name large above). Add `.party-pick` card styling for the Task 9 picker.

- [ ] **Step 3: Verify against the three mockups**

Open `/rsvp/`. Compare steps to `/tmp/wedding_mock/rsvp_page_{1,2,3}.png`. Confirm copy reads "not attending" (typo fixed), the deadline reads "September 26, 2026" on steps 1 and 3, and a real submit writes a row (per the 9vd1 PUT path).

- [ ] **Step 4: Commit**

```bash
git add rsvp/index.html rsvp/styles.css
git commit -m "Restyle RSVP 3-step flow to deco cards; fix copy + deadline date"
```

---

## Stage 5 — Home

### Task 11: Responsive engagement photos

**Files:**
- Modify: `home/index.html`, `home/styles.css`

**Interfaces:**
- Consumes: `images/home-desktop.*`, `images/home-mobile.*` (Task 2).

- [ ] **Step 1: Replace the hero with a responsive `<picture>`**

In `home/index.html`, swap the current hero `<img>` for:

```html
<picture>
  <source media="(max-width: 700px)" type="image/avif" srcset="/images/home-mobile.avif">
  <source media="(max-width: 700px)" type="image/webp" srcset="/images/home-mobile.webp">
  <source type="image/avif" srcset="/images/home-desktop.avif">
  <source type="image/webp" srcset="/images/home-desktop.webp">
  <img src="/images/home-desktop.webp" alt="Andy and Sam" width="1600" height="HEIGHT" fetchpriority="high">
</picture>
```
Set `HEIGHT` to the desktop photo's real height from Task 2 Step 2.

- [ ] **Step 2: Style the home content**

In `home/styles.css` ensure the `<picture>`/`<img>` is responsive (`max-width:100%; height:auto; display:block`) inside the deco/cabinet layout, with the names/date/place + RSVP button per the home concept.

- [ ] **Step 3: Verify**

Open `/home/` at desktop and <700px widths: landscape photo on desktop, portrait on mobile, no layout shift (dimensions set), image is the LCP and loads eagerly.

- [ ] **Step 4: Commit**

```bash
git add home/index.html home/styles.css
git commit -m "Home: responsive engagement photos via <picture>"
```

---

## Stage 6 — Content pages

### Task 12: Deco cards for schedule / travel / faq

**Files:**
- Modify: `schedule/index.html` + `styles.css`, `travel/index.html` + `styles.css`, `faq/index.html` + `styles.css`

**Interfaces:**
- Consumes: `.deco-card` (Task 8), the shell chrome (Stage 2).

- [ ] **Step 1: Wrap each page's content in `.deco-card`**

In each of the three pages, wrap `<main>` content in the `.deco-card` treatment, keeping existing copy/structure (including TBD placeholders — content is out of scope). Trim page `styles.css` rules now covered by `card.css`.

- [ ] **Step 2: Verify**

Open `/schedule/`, `/travel/`, `/faq/`. Each shows the radio chrome + a parchment deco card consistent with the gate/RSVP cards; nav highlights the correct station; layout holds at mobile width.

- [ ] **Step 3: Commit**

```bash
git add schedule/index.html schedule/styles.css travel/index.html travel/styles.css faq/index.html faq/styles.css
git commit -m "Restyle schedule/travel/faq with shell chrome + deco cards"
```

---

## Stage 7 — Verification pass

### Task 13: Cross-cutting verification

**Files:** none (verification + any fixes surfaced).

- [ ] **Step 1: Responsive sweep**

At 1440px, 768px, and 375px widths, load every page (gate, home, rsvp ×3 steps, schedule, travel, faq). Confirm the dial↔knob-menu switch at 700px, no overflow, cards readable.

- [ ] **Step 2: Navigation matrix**

Verify each nav path works via (a) station click, (b) desktop knob drag-release, (c) mobile menu tap. Back/forward buttons work. Current-station highlight + needle/arrow correct on each landing.

- [ ] **Step 3: Progressive-enhancement + a11y**

Disable JavaScript → station links still navigate (no knob, but functional). Tab through the dial → links focusable; `#knob` has `aria-label`. Enable OS reduced-motion → no View Transitions, nav still works. Firefox → instant nav, no console errors.

- [ ] **Step 4: Gate + RSVP end-to-end**

Fresh window: gate (correct last name) → `/home/`; open `/home/` with no token → bounced to `/`; complete an RSVP including the duplicate-last-name picker → thank-you; confirm a row lands via the API.

- [ ] **Step 5: Fix and commit any issues found**

```bash
git add -A
git commit -m "Fix issues from redesign verification pass"
```

---

## Self-Review Notes

- **Spec coverage:** shell/gradient/title (T4), dial+knob nav + VT + sync-on-load (T5–T7), deco card (T8), gate (T8), RSVP 3-step + picker (T9–T10), home photos (T2,T11), content pages (T12), asset pipeline (T1–T2), fonts incl. Contralto gap (T3), verification (T13). All spec sections mapped.
- **Open items carried:** Contralto weights resolved in T3 Step 1 (branch on file availability); exact dial geometry traced in T5 Step 3 from the desktop SVG.
- **Type consistency:** `partiesByLastName`/`labelForParty` (T9), `angleFromStation`/`stationFromAngle`/`angleFromPointer` (T6), `NAV`/`currentIndex` (T5) referenced consistently downstream.
