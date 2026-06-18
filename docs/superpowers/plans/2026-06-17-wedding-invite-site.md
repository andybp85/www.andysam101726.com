# Wedding Invite Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Project tracking:** This repo tracks work with **beans**, not TodoWrite. Create one bean per task below (or one epic with task children) and check off as you go. The plan checkboxes are the granular execution steps within each bean.

**Goal:** Turn the save-the-date gate into the full 5-page digital wedding invitation (Home, RSVP, Schedule, Travel, FAQ) behind the existing last-name password gate, styled per the art-deco rough drafts, with a party-aware RSVP flow.

**Architecture:** Static, hand-written HTML/CSS/vanilla JS on GitHub Pages — no build step, no framework, no `package.json`. A shared `site.js` renders the nav and runs the token guard on each page. The guest list lives as an in-code constant in the Google Apps Script API (separate repo); it is fetched once (token-gated) right after the gate and cached in `sessionStorage`, so the RSVP name→party lookup is instant and client-side. RSVP submission is optimistic (UI confirms immediately, single Sheet append in the background).

**Tech Stack:** HTML5, CSS (custom props + `clamp()` fluid type), vanilla JS (ES2020), Google Apps Script (`.gs`) backend, Google Sheets storage. Asset tooling (one-off, build-time only): `woff2_compress` (fonts), `rsvg-convert` + `cwebp` (backgrounds), `node` (guest-list generator).

## Global Constraints

- **No build step, no dependencies, no framework.** Edit files directly; test in a browser. (Asset/codegen tools are one-off, not shipped runtime deps.)
- **Absolute root-relative asset paths** (`/styles/...`, `/images/...`, `/fonts/...`) so pages work from any subdirectory.
- **Search-indexing stays disabled:** every page keeps `<meta name="robots" content="nofollow, noindex">` and the existing `robots.txt`.
- **Every page except `/` requires a gate token.** An inline `<head>` guard redirects to `/` when `localStorage.token` is absent.
- **Guest list is never shipped in a static file.** It is returned only by the token-gated `GUESTS` API call.
- **Optimized assets:** each background image < 200KB; each web font < 80KB.
- **Names/venue (verbatim):** "Andy Stanish & Sam Harber"; "The Madison Hotel", "Morristown, NJ".
- **Dates (verbatim):** Rehearsal Dinner — **Friday, October 16, 2026**; Wedding — **Saturday, October 17, 2026**; Brunch — **Sunday, October 18, 2026**. Home hero date: **October 17, 2026**.
- **Fonts/roles:** `lucian_schoenschrift` (cursive title), `nickerbocker` (deco nav labels), `contralto` (body/headings).
- **API exec URL** (existing, reuse): `https://script.google.com/macros/s/AKfycbzlDfJdr-lTdTmOuNGXMYS-53jjXf1QCW_dD_I6ZmLYRSO_Y7UCgzcGertCfHIT5nbx/exec`

## API Contract (used by Tasks 4–5 and 6–8)

All requests are `POST` with `FormData` fields. Responses are JSON.

```
VERB=POST   { password }                  -> { status:'success', token, redirect:'/home/' } | { status:'fail', message }
VERB=GUESTS { token }                      -> { status:'success', guests:{ "<group>":[{first,last,slot}] } } | { status:'unauthorized' }
VERB=PUT    { token, group, responses }    -> { status:'success' } | { status:'unauthorized' }
            responses = JSON string of [ { first, last, attending:bool, isGuest:bool } ]
```

## File Structure

**Main repo (`www.andysamwedding.com`):**
- `fonts/lucian-schoenschrift.woff2`, `fonts/nickerbocker.woff2`, `fonts/contralto-regular.woff2` — new web fonts (created).
- `styles/lucian-schoenschrift.css`, `styles/nickerbocker.css`, `styles/contralto.css` — `@font-face` files (created).
- `styles/nav.css` — shared brass nav + mobile drawer styling (created).
- `styles/root.css` — add font imports, nav import, wood-grain bg, brass tokens (modified).
- `images/wood-desktop.webp`, `images/wood-mobile.webp` — optimized backgrounds (created).
- `site.js` — shared nav renderer (created).
- `index.html`, `styles.css`, `index.js` — gate, restyled + GUESTS prefetch (modified).
- `home/index.html`, `home/styles.css` — landing (created).
- `rsvp/index.html`, `rsvp/styles.css`, `rsvp/index.js` — two-step RSVP (created).
- `schedule/index.html`, `schedule/styles.css` — schedule (created).
- `travel/index.html`, `travel/styles.css` — travel (created).
- `faq/index.html`, `faq/styles.css` — faq (created).
- `tools/gen-guests.mjs` — CSV→`guests.gs` generator (created).
- `savethedate/` — removed.

**API repo (`../andysamwedding-api`):**
- `guests.gs` — generated guest-list constant (created).
- `Code.gs` — add `GUESTS`, rewrite `rsvp()`, redirect `/home/` (modified).

---

## Task 1: Web fonts → woff2 + `@font-face`

**Files:**
- Create: `fonts/lucian-schoenschrift.woff2`, `fonts/nickerbocker.woff2`, `fonts/contralto-regular.woff2`
- Create: `styles/lucian-schoenschrift.css`, `styles/nickerbocker.css`, `styles/contralto.css`

**Interfaces:**
- Produces: CSS font families `lucian_schoenschrift`, `nickerbocker`, `contralto` (consumed by Task 3 `root.css` and all pages).

- [ ] **Step 1: Install the woff2 encoder**

Run: `brew install woff2`
Expected: `woff2_compress` on PATH (`command -v woff2_compress` prints a path). `brotli` python module is absent, so `fonttools` can't do woff2 — use `woff2_compress`.

- [ ] **Step 2: Convert the three source fonts**

Run from repo root:
```bash
woff2_compress "new_design/lucien-schoenschriftv-cat/Lucian Schoenschrift CAT.ttf"
mv "new_design/lucien-schoenschriftv-cat/Lucian Schoenschrift CAT.woff2" fonts/lucian-schoenschrift.woff2

woff2_compress new_design/nickerbocker-normal/NickerbockerNF.ttf
mv new_design/nickerbocker-normal/NickerbockerNF.woff2 fonts/nickerbocker.woff2

woff2_compress new_design/fonnts.com-221648/fonts/fonnts.com-Contralto_Small_Regular.otf
mv new_design/fonnts.com-221648/fonts/fonnts.com-Contralto_Small_Regular.woff2 fonts/contralto-regular.woff2
```

- [ ] **Step 3: Verify the woff2 files exist and are small**

Run: `ls -la fonts/*.woff2`
Expected: three files present, each well under 80KB.

- [ ] **Step 4: Write the `@font-face` CSS files**

`styles/lucian-schoenschrift.css`:
```css
@font-face {
    font-family: lucian_schoenschrift;
    src: url("/fonts/lucian-schoenschrift.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
```

`styles/nickerbocker.css`:
```css
@font-face {
    font-family: nickerbocker;
    src: url("/fonts/nickerbocker.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
```

`styles/contralto.css`:
```css
@font-face {
    font-family: contralto;
    src: url("/fonts/contralto-regular.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
```

- [ ] **Step 5: Commit**

```bash
git add fonts/*.woff2 styles/lucian-schoenschrift.css styles/nickerbocker.css styles/contralto.css
git commit -m "Add converted woff2 fonts and @font-face files"
```

---

## Task 2: Optimize wood-grain backgrounds

**Files:**
- Create: `images/wood-desktop.webp`, `images/wood-mobile.webp`

**Interfaces:**
- Produces: `/images/wood-desktop.webp`, `/images/wood-mobile.webp` (consumed by Task 3 `root.css`).

- [ ] **Step 1: Rasterize the SVGs and encode WebP**

Run from repo root:
```bash
rsvg-convert -w 1920 new_design/wood_grain_for_desktop.svg -o /tmp/wood-desktop.png
cwebp -q 80 /tmp/wood-desktop.png -o images/wood-desktop.webp
rsvg-convert -w 1080 new_design/wood_grain_for_mobile.svg -o /tmp/wood-mobile.png
cwebp -q 80 /tmp/wood-mobile.png -o images/wood-mobile.webp
```

- [ ] **Step 2: Verify both are under 200KB**

Run: `ls -la images/wood-desktop.webp images/wood-mobile.webp`
Expected: both files exist, each < 200KB. If either exceeds 200KB, re-run its `cwebp` with `-q 70`.

- [ ] **Step 3: Commit**

```bash
git add images/wood-desktop.webp images/wood-mobile.webp
git commit -m "Add optimized wood-grain background images"
```

---

## Task 3: Shared styling tokens, nav CSS, and `site.js`

**Files:**
- Modify: `styles/root.css`
- Create: `styles/nav.css`, `site.js`

**Interfaces:**
- Consumes: font families from Task 1; `/images/wood-*.webp` from Task 2.
- Produces:
  - CSS custom props on `:root`: `--brass`, `--brass-dark`, `--ink` (consumed by all page styles).
  - Element `<div id="site-nav"></div>` is filled by `site.js` with nav markup.
  - `site.js` renders nav with active-link highlighting based on `location.pathname`; toggles `#nav-links.open` via `#nav-toggle`.

- [ ] **Step 1: Extend `styles/root.css`**

Replace the top `@import` block and `:root`/`html`/`body` rules in `styles/root.css` with:
```css
@import "modern-normalize.css";
@import "decomanghold-regular.css";
@import "dream_orphansregular.css";
@import "lucian-schoenschrift.css";
@import "nickerbocker.css";
@import "contralto.css";
@import "nav.css";

:root {
    --body-text-color: #e2c06e;
    --body-font-size: clamp(1rem, 0.158rem + 4.21vw, 2rem);
    --placeholder-color: #f6e7c8;
    --brass: #e2c06e;
    --brass-dark: #8a6d2f;
    --ink: #2a1a14;
}

html {
    height: 100%;
    background-color: #2a1a14;
}

body {
    font-family: contralto, serif;
    background-image: url("/images/wood-desktop.webp");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
    line-height: 1.5;
    color: var(--body-text-color);
    font-size: var(--body-font-size);
}

@media (max-width: 700px) {
    body { background-image: url("/images/wood-mobile.webp"); }
}
```
Then change the `h1` rule's `font-family` from `decomang_holdregular` to `lucian_schoenschrift`. Leave the rest of `root.css` (main border/decoration, submit button, error-msg, visuallyhidden, submitting animation) unchanged.

- [ ] **Step 2: Create `styles/nav.css`**

```css
#site-nav {
    width: 70vw;
    max-width: 57rem;
    margin: 1vh auto 2vh;
    text-align: center;
}

#nav-toggle {
    display: none;
    font-family: nickerbocker, serif;
    font-size: var(--body-font-size);
    color: var(--ink);
    background: linear-gradient(180deg, var(--brass), var(--brass-dark));
    border: 2px solid var(--brass-dark);
    border-radius: 999px;
    padding: 0.3em 1.2em;
    cursor: pointer;
}

#nav-links {
    display: flex;
    justify-content: center;
    gap: clamp(0.8rem, 3vw, 2.5rem);
    background: linear-gradient(180deg, var(--brass), var(--brass-dark));
    border: 3px solid var(--brass-dark);
    border-radius: 0.6rem;
    padding: 0.5em 1em;
}

#nav-links a {
    font-family: nickerbocker, serif;
    text-decoration: none;
    color: var(--ink);
    letter-spacing: 0.06em;
}

#nav-links a.active {
    color: #fff;
    text-shadow: 0 1px 2px var(--ink);
}

@media (max-width: 700px) {
    #nav-toggle { display: inline-block; }
    #nav-links {
        display: none;
        flex-direction: column;
        margin-top: 0.6em;
    }
    #nav-links.open { display: flex; }
}
```

- [ ] **Step 3: Create `site.js`**

```javascript
const NAV = [
    ['HOME', '/home/'],
    ['RSVP', '/rsvp/'],
    ['SCHEDULE', '/schedule/'],
    ['TRAVEL', '/travel/'],
    ['FAQ', '/faq/'],
]

function renderNav() {
    const here = location.pathname
    const links = NAV.map(([label, href]) => {
        const active = here === href || here === href.slice(0, -1) ? ' class="active"' : ''
        return `<a href="${href}"${active}>${label}</a>`
    }).join('')

    const nav = document.getElementById('site-nav')
    nav.innerHTML =
        `<button id="nav-toggle" aria-label="Menu" aria-expanded="false">MENU</button>` +
        `<div id="nav-links">${links}</div>`

    const toggle = document.getElementById('nav-toggle')
    const linksEl = document.getElementById('nav-links')
    toggle.addEventListener('click', () => {
        const open = linksEl.classList.toggle('open')
        toggle.setAttribute('aria-expanded', String(open))
    })
}

renderNav()
```

- [ ] **Step 4: Verify nav renders and highlights (manual)**

Run: `python3 -m http.server 8000` from repo root. Create a throwaway `home/index.html` is not needed yet; instead verify against a page in a later task. For now, lint-check by opening DevTools on any later page. Mark this step done once Task 7 confirms nav render. (No standalone artifact to view yet — `site.js` and `nav.css` are exercised by Task 7.)

- [ ] **Step 5: Commit**

```bash
git add styles/root.css styles/nav.css site.js
git commit -m "Add shared brass nav styling, wood-grain bg tokens, and site.js"
```

---

## Task 4: Guest-list generator → `guests.gs`

**Files:**
- Create: `tools/gen-guests.mjs` (main repo)
- Create: `../andysamwedding-api/guests.gs` (API repo)

**Interfaces:**
- Consumes: `new_design/RSVP_list.csv`.
- Produces: API-repo `guests.gs` defining `const GUESTS = { "<group>": [ {first, last, slot} ] }` (consumed by Task 5).

- [ ] **Step 1: Write `tools/gen-guests.mjs`**

```javascript
import { readFileSync, writeFileSync } from 'node:fs'

const [, , inPath, outPath] = process.argv
if (!inPath || !outPath) {
    console.error('usage: node tools/gen-guests.mjs <in.csv> <out.gs>')
    process.exit(1)
}

const rows = readFileSync(inPath, 'utf8').split(/\r?\n/).slice(1) // drop header
const groups = {}

for (const row of rows) {
    if (!row.trim()) continue
    const [group, first, last] = row.split(',').map(s => (s ?? '').trim())
    if (!group) continue // separator row
    ;(groups[group] ??= []).push({ first, last, slot: first === '' && last === '' })
}

const out = `// GENERATED by tools/gen-guests.mjs from RSVP_list.csv — do not edit by hand.\n` +
    `const GUESTS = ${JSON.stringify(groups, null, 2)}\n`
writeFileSync(outPath, out)
console.log(`Wrote ${Object.keys(groups).length} groups to ${outPath}`)
```

- [ ] **Step 2: Generate `guests.gs` into the API repo**

Run from main repo root:
```bash
node tools/gen-guests.mjs new_design/RSVP_list.csv ../andysamwedding-api/guests.gs
```
Expected: `Wrote 93 groups to ../andysamwedding-api/guests.gs`

- [ ] **Step 3: Spot-check the generated data**

Run: `node -e 'const m=require("node:fs").readFileSync("../andysamwedding-api/guests.gs","utf8"); const g=JSON.parse(m.slice(m.indexOf("{"), m.lastIndexOf("}")+1)); console.log(Object.keys(g).length, JSON.stringify(g.afam2), JSON.stringify(g.sfam3))'`
Expected: `93 [{"first":"Chris","last":"Stanish","slot":false},{"first":"","last":"","slot":true}] [...6 members incl one slot...]`

- [ ] **Step 4: Commit (both repos)**

```bash
git add tools/gen-guests.mjs
git commit -m "Add guest-list generator"
cd ../andysamwedding-api && git add guests.gs && git commit -m "Add generated guest list" && cd -
```

---

## Task 5: API — add `GUESTS`, rewrite `rsvp()`, redirect `/home/`

**Files:**
- Modify: `../andysamwedding-api/Code.gs`

**Interfaces:**
- Consumes: `GUESTS` from `guests.gs` (Task 4); existing `auth`, `respond`, `tokensSheetId`, `rsvpSheetId`.
- Produces: the API Contract behaviors (consumed by Tasks 6–8).

- [ ] **Step 1: Change the auth redirect**

In `Code.gs` `auth()`, change the success return's redirect:
```javascript
return respond({status: 'success', token, redirect: '/home/'})
```

- [ ] **Step 2: Route the `GUESTS` verb in `doPost`**

In `doPost`, add a branch alongside the existing POST/PUT checks:
```javascript
function doPost(e) {
    try {
        if (e.parameter?.VERB === 'POST') return auth(e.parameter)
        else if (e.parameter?.VERB === 'GUESTS') return guests(e.parameter)
        else if (e.parameter?.VERB === 'PUT') return rsvp(e.parameter)
    } catch (e) {
        return respond({status: 'error', message: e.message})
    }
    return respond({status: 'fail', message: 'invalid request', parameter: e.parameter})
}
```

- [ ] **Step 3: Add a token-membership helper and the `guests` handler**

Add to `Code.gs`:
```javascript
function tokenIsValid(token) {
    if (!token) return false
    const sheet = SpreadsheetApp.openById(tokensSheetId)
    sheet.setActiveSheet(sheet.getSheets()[0])
    const col = sheet.getSheetValues(1, 1, -1, 1)
    return col.some(row => row[0] === token)
}

// verb: GUESTS — token-gated guest list for prefetch
function guests(contents) {
    if (!tokenIsValid(contents.token))
        return respond({status: 'unauthorized', message: 'invalid token'})
    return respond({status: 'success', guests: GUESTS})
}
```

- [ ] **Step 4: Rewrite `rsvp()` for party responses, no rotation**

Replace the existing `rsvp()` body with:
```javascript
// verb: PUT — party RSVP, optimistic; validate token by membership (no rotation)
function rsvp(contents) {
    if (!tokenIsValid(contents.token))
        return respond({status: 'unauthorized', message: 'invalid token'})

    let responses = []
    try {
        responses = JSON.parse(contents.responses || '[]')
    } catch (err) {
        return respond({status: 'error', message: 'bad responses payload'})
    }

    const ts = Date.now()
    const group = contents.group || ''
    const rsvpSheet = SpreadsheetApp.openById(rsvpSheetId)
    rsvpSheet.setActiveSheet(rsvpSheet.getSheets()[0])

    for (const r of responses)
        rsvpSheet.appendRow([ts, group, r.first || '', r.last || '', r.attending ? 'yes' : 'no', r.isGuest ? 'guest' : ''])

    MailApp.sendEmail('andysam101726@gmail.com', 'RSVP from site',
        JSON.stringify({ts, group, responses}, null, 2))

    return respond({status: 'success'})
}
```

- [ ] **Step 5: Deploy and test the contract**

Push and deploy (re-deploy the existing Web App so the `/exec` URL is unchanged):
```bash
cd ../andysamwedding-api && clasp push && cd -
```
Then in the Apps Script editor, deploy → Manage deployments → edit the active deployment → new version. Test `GUESTS` with a fresh token. First obtain a token:
```bash
EXEC='https://script.google.com/macros/s/AKfycbzlDfJdr-lTdTmOuNGXMYS-53jjXf1QCW_dD_I6ZmLYRSO_Y7UCgzcGertCfHIT5nbx/exec'
curl -sL "$EXEC" --data-urlencode 'VERB=POST' --data-urlencode 'password=<bride-or-groom-last-name>'
```
Expected: `{"status":"success","token":"<uuid>","redirect":"/home/"}`. Then:
```bash
curl -sL "$EXEC" --data-urlencode 'VERB=GUESTS' --data-urlencode 'token=<uuid>'
```
Expected: `{"status":"success","guests":{...93 groups...}}`. Then a test RSVP:
```bash
curl -sL "$EXEC" --data-urlencode 'VERB=PUT' --data-urlencode 'token=<uuid>' \
  --data-urlencode 'group=afam2' \
  --data-urlencode 'responses=[{"first":"Chris","last":"Stanish","attending":true,"isGuest":false}]'
```
Expected: `{"status":"success"}` and a new row in the RSVP sheet.

- [ ] **Step 6: Commit**

```bash
cd ../andysamwedding-api && git add Code.gs && git commit -m "Add GUESTS verb, party RSVP, redirect to /home" && cd -
```

---

## Task 6: Restyle gate + prefetch guest list

**Files:**
- Modify: `index.html`, `styles.css`, `index.js`

**Interfaces:**
- Consumes: API `POST` (token + redirect) and `GUESTS`.
- Produces: on success, `localStorage.token`, `localStorage.redirect`, and `sessionStorage.guests` (consumed by Task 8).

- [ ] **Step 1: Point the gate stylesheet at root.css tokens**

In `index.html`, the gate already links `/styles.css`. Update `styles.css` to begin with `@import "/styles/root.css";` (if not already) so the gate inherits the new wood-grain background and fonts. Keep the existing gate-specific rules (form, password input, submit button) below the import. The title `<h1>` will now render in `lucian_schoenschrift` automatically.

- [ ] **Step 2: Prefetch the guest list on successful login**

In `index.js`, replace the success branch so it caches the token, prefetches guests, then redirects:
```javascript
const API = 'https://script.google.com/macros/s/AKfycbzlDfJdr-lTdTmOuNGXMYS-53jjXf1QCW_dD_I6ZmLYRSO_Y7UCgzcGertCfHIT5nbx/exec'

loginForm.addEventListener('submit', e => {
    e.preventDefault()
    submitButton.classList.add('submitting')
    const formData = new FormData(e.target)

    fetch(API, {method: 'POST', body: formData})
        .then(r => r.json())
        .then(async r => {
            if (r.status !== 'success') throw new Error(r.message)
            localStorage.setItem('token', r.token)
            localStorage.setItem('redirect', r.redirect)
            await prefetchGuests(r.token)
            window.location = r.redirect
        })
        .catch(e => {
            document.getElementById('error-msg').innerText = e.message
            console.error(e)
        })
        .finally(() => submitButton.classList.remove('submitting'))
})

async function prefetchGuests(token) {
    try {
        const body = new FormData()
        body.append('VERB', 'GUESTS')
        body.append('token', token)
        const r = await (await fetch(API, {method: 'POST', body})).json()
        if (r.status === 'success')
            sessionStorage.setItem('guests', JSON.stringify(r.guests))
    } catch (err) {
        console.warn('guest prefetch failed; rsvp page will fetch on demand', err)
    }
}
```
Keep the existing `loginForm` / `submitButton` constants at the top of the file. The redirect target now comes from the API as `/home/`.

- [ ] **Step 3: Verify the gate (manual)**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/`. Confirm: wood-grain background, cursive title, password form styled. Submit a correct last name → DevTools → Application → `localStorage.token` set, `sessionStorage.guests` populated, and the page navigates to `/home/` (404 until Task 7 — that's expected here).

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css index.js
git commit -m "Restyle gate and prefetch guest list on login"
```

---

## Task 7: Home page

**Files:**
- Create: `home/index.html`, `home/styles.css`
- Asset placeholder: `images/hero.jpg` (couple supplies the engagement photo)

**Interfaces:**
- Consumes: `/styles/root.css`, `/site.js`.
- Produces: the first page that renders the shared nav (validates Task 3 Step 4).

- [ ] **Step 1: Add a hero photo placeholder**

Run: `magick -size 1200x800 canvas:'#3a241b' -gravity center -fill '#e2c06e' -pointsize 48 -annotate 0 'engagement photo\n(replace /images/hero.jpg)' images/hero.jpg`
Expected: `images/hero.jpg` exists. (The couple replaces this file with the real photo; the page references `/images/hero.jpg`.)

- [ ] **Step 2: Create `home/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Andy & Sam">
    <meta name="description" content="Andy & Sam's digital wedding invitation site">
    <meta name="theme-color" content="black">
    <meta name="robots" content="nofollow, noindex">
    <title>Andy & Sam's Wedding</title>
    <link rel="stylesheet" href="/home/styles.css">
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <script>if (!localStorage.getItem('token')) location.replace('/')</script>
</head>
<body>
<h1>Andy &amp; Sam's Wedding</h1>
<div id="site-nav"></div>
<main>
    <section class="hero">
        <img src="/images/hero.jpg" alt="Andy and Sam">
        <div class="hero-overlay">
            <p class="names">Andy Stanish &amp; Sam Harber</p>
            <p class="date">October 17, 2026</p>
            <p class="place">Morristown, NJ</p>
            <a class="rsvp-btn" href="/rsvp/">RSVP</a>
        </div>
    </section>
    <section class="details">
        <p class="names">Andy Stanish &amp; Sam Harber</p>
        <p class="date">October 17, 2026</p>
        <p class="place">The Madison Hotel<br>Morristown, NJ</p>
        <a class="rsvp-btn big" href="/rsvp/">RSVP</a>
    </section>
</main>
<script src="/site.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create `home/styles.css`**

```css
@import "/styles/root.css";

main {
    border: 4px solid var(--body-text-color);
    border-radius: 1vh;
    background-color: rgba(0, 0, 0, 0.75);
    width: 70vw;
    max-width: 57rem;
    text-align: center;
    padding: 2vh 4vw;
}

.hero { position: relative; }
.hero img { width: 100%; border-radius: 0.5rem; display: block; }
.hero-overlay {
    position: absolute;
    left: 0; bottom: 1rem;
    width: 100%;
    text-shadow: 0 2px 6px #000;
}
.details { margin-top: 3vh; }
.names { font-size: 1.4em; }
.date { font-size: 1.2em; }
.place { margin-bottom: 1.5rem; }

.rsvp-btn {
    display: inline-block;
    font-family: nickerbocker, serif;
    color: var(--ink);
    background: linear-gradient(180deg, var(--brass), var(--brass-dark));
    border: 2px solid var(--brass-dark);
    border-radius: 0.4rem;
    padding: 0.4em 2em;
    text-decoration: none;
}
.rsvp-btn.big { padding: 0.5em 3em; font-size: 1.2em; }
```

- [ ] **Step 4: Verify the home page + nav (manual; closes Task 3 Step 4)**

Run: `python3 -m http.server 8000`. In DevTools console first set a token so the guard passes: `localStorage.setItem('token','test')`. Open `http://localhost:8000/home/`. Confirm: wood-grain bg, cursive `<h1>`, brass nav bar with HOME highlighted, hero image + overlay, RSVP buttons link to `/rsvp/`. Resize to < 700px → nav collapses to a MENU button that toggles a vertical drawer.

- [ ] **Step 5: Commit**

```bash
git add home/index.html home/styles.css images/hero.jpg
git commit -m "Add home page"
```

---

## Task 8: RSVP page (two-step party flow)

**Files:**
- Create: `rsvp/index.html`, `rsvp/styles.css`, `rsvp/index.js`

**Interfaces:**
- Consumes: `sessionStorage.guests` (Task 6) or `GUESTS` API on demand; `PUT` API (Task 5).
- Produces: terminal RSVP submission.

- [ ] **Step 1: Create `rsvp/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Andy & Sam">
    <meta name="description" content="Andy & Sam's digital wedding invitation site">
    <meta name="theme-color" content="black">
    <meta name="robots" content="nofollow, noindex">
    <title>RSVP — Andy & Sam's Wedding</title>
    <link rel="stylesheet" href="/rsvp/styles.css">
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <script>if (!localStorage.getItem('token')) location.replace('/')</script>
</head>
<body>
<h1>Andy &amp; Sam's Wedding</h1>
<div id="site-nav"></div>
<main>
    <section id="step-name">
        <p>Please enter the first and last name of one of your party's members.
            You will be able to RSVP for each party member on the next page.</p>
        <p class="deadline">RSVP deadline is Sept 1st 2026.</p>
        <form id="name-form">
            <label class="visuallyhidden" for="first">First name</label>
            <input id="first" name="first" placeholder="First name" autocomplete="off" required>
            <label class="visuallyhidden" for="last">Last name</label>
            <input id="last" name="last" placeholder="Last name" autocomplete="off">
            <p class="hint">(ie "John Smith", not "The Smith Party" etc)</p>
            <div id="name-error" class="error"></div>
            <button type="submit">continue</button>
        </form>
    </section>

    <section id="step-party" hidden>
        <form id="party-form">
            <div id="members"></div>
            <div id="submit-error" class="error"></div>
            <button type="submit">submit</button>
        </form>
    </section>

    <section id="step-thanks" hidden>
        <p>Thank you! Your RSVP has been recorded.</p>
    </section>
</main>
<script src="/site.js"></script>
<script src="/rsvp/index.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `rsvp/index.js`**

```javascript
const API = 'https://script.google.com/macros/s/AKfycbzlDfJdr-lTdTmOuNGXMYS-53jjXf1QCW_dD_I6ZmLYRSO_Y7UCgzcGertCfHIT5nbx/exec'
const norm = s => (s || '').trim().toLowerCase()

let matchedGroup = null  // { id, members:[{first,last,slot}] }

async function getGuests() {
    const cached = sessionStorage.getItem('guests')
    if (cached) return JSON.parse(cached)
    const body = new FormData()
    body.append('VERB', 'GUESTS')
    body.append('token', localStorage.getItem('token'))
    const r = await (await fetch(API, {method: 'POST', body})).json()
    if (r.status !== 'success') throw new Error('Could not load the guest list. Please try again.')
    sessionStorage.setItem('guests', JSON.stringify(r.guests))
    return r.guests
}

function findGroup(guests, first, last) {
    const f = norm(first), l = norm(last)
    for (const [id, members] of Object.entries(guests)) {
        const hit = members.some(m =>
            !m.slot && norm(m.first) === f && (norm(m.last) === l || m.last === '' || l === ''))
        if (hit) return {id, members}
    }
    return null
}

function renderParty(group) {
    const wrap = document.getElementById('members')
    wrap.innerHTML = group.members.map((m, i) => {
        const nameCell = m.slot
            ? `<input class="guest-name" data-i="${i}" placeholder="name">
               <label class="guest-flag"><input type="checkbox" class="guest-check" data-i="${i}"> Guest</label>`
            : `<span class="member-name">${m.first} ${m.last}</span>`
        return `<fieldset class="member" data-i="${i}">
            ${nameCell}
            <label><input type="radio" name="att-${i}" value="yes" checked> Attending</label>
            <label><input type="radio" name="att-${i}" value="no"> Not attending</label>
        </fieldset>`
    }).join('')
}

document.getElementById('name-form').addEventListener('submit', async e => {
    e.preventDefault()
    const err = document.getElementById('name-error')
    err.textContent = ''
    try {
        const guests = await getGuests()
        const group = findGroup(guests, e.target.first.value, e.target.last.value)
        if (!group) {
            err.textContent = "We couldn't find that name. Please check the spelling, or contact us."
            return
        }
        matchedGroup = group
        renderParty(group)
        document.getElementById('step-name').hidden = true
        document.getElementById('step-party').hidden = false
    } catch (ex) {
        err.textContent = ex.message
    }
})

document.getElementById('party-form').addEventListener('submit', e => {
    e.preventDefault()
    const responses = matchedGroup.members.map((m, i) => {
        const fs = document.querySelector(`.member[data-i="${i}"]`)
        const attending = fs.querySelector(`input[name="att-${i}"]:checked`).value === 'yes'
        if (m.slot) {
            const name = fs.querySelector('.guest-name').value.trim()
            const isGuest = fs.querySelector('.guest-check').checked || name === ''
            const [first, ...rest] = name.split(' ')
            return {first: isGuest && !name ? 'Guest' : (first || 'Guest'), last: rest.join(' '), attending, isGuest}
        }
        return {first: m.first, last: m.last, attending, isGuest: false}
    })

    // optimistic: confirm immediately, write in background
    document.getElementById('step-party').hidden = true
    document.getElementById('step-thanks').hidden = false

    const body = new FormData()
    body.append('VERB', 'PUT')
    body.append('token', localStorage.getItem('token'))
    body.append('group', matchedGroup.id)
    body.append('responses', JSON.stringify(responses))
    fetch(API, {method: 'POST', body})
        .then(r => r.json())
        .then(r => { if (r.status !== 'success') throw new Error(r.message) })
        .catch(ex => {
            document.getElementById('step-thanks').hidden = true
            document.getElementById('step-party').hidden = false
            document.getElementById('submit-error').textContent =
                'Something went wrong saving your RSVP. Please try submitting again.'
            console.error(ex)
        })
})
```

- [ ] **Step 3: Create `rsvp/styles.css`**

```css
@import "/styles/root.css";

main {
    border: 4px solid var(--body-text-color);
    border-radius: 1vh;
    background-color: rgba(0, 0, 0, 0.75);
    width: 70vw;
    max-width: 50rem;
    text-align: center;
    padding: 2vh 4vw;
}

.deadline { font-weight: bold; }
.hint { font-size: 0.8em; opacity: 0.8; }
.error { color: red; min-height: 1.2em; }

#name-form input { display: block; margin: 0.5rem auto; width: min(100%, 24rem); padding: 0.4em; }

.member {
    border: 2px solid var(--brass-dark);
    border-radius: 0.4rem;
    margin: 0.8rem 0;
    padding: 0.6rem;
    text-align: left;
}
.member-name { font-size: 1.2em; display: block; margin-bottom: 0.3rem; }
.member label { margin-right: 1rem; }
.guest-name { padding: 0.3em; margin-right: 0.5rem; }

button[type="submit"] {
    font-family: nickerbocker, serif;
    color: var(--ink);
    background: linear-gradient(180deg, var(--brass), var(--brass-dark));
    border: 2px solid var(--brass-dark);
    border-radius: 0.4rem;
    padding: 0.4em 2.5em;
    cursor: pointer;
    margin-top: 1rem;
}
```
Note: this page's `button[type="submit"]` intentionally overrides the SVG submit button from `root.css` (the gate's rotating button) with a plain brass button.

- [ ] **Step 4: Verify the RSVP flow (manual)**

Run: `python3 -m http.server 8000`. In DevTools: `localStorage.setItem('token','test')`, then seed a fixture so no backend is needed:
```js
sessionStorage.setItem('guests', JSON.stringify({
  afam1:[{first:'Maria',last:'Stanish',slot:false},{first:'John',last:'Stanish',slot:false}],
  afam2:[{first:'Chris',last:'Stanish',slot:false},{first:'',last:'',slot:true}],
  sfam3:[{first:'Honey',last:'Kostyn',slot:false},{first:'Ray',last:'Kostyn',slot:false},{first:'Jen',last:'Kostyn',slot:false},{first:'',last:'',slot:true},{first:'Amy',last:'Jenkins',slot:false},{first:'Ben',last:'Jenkins',slot:false}],
  afriend10:[{first:'Ryan',last:'Williams',slot:false},{first:'Christian',last:'',slot:false}]
}))
```
Open `http://localhost:8000/rsvp/`. Verify each case:
- Enter `Maria Stanish` → step 2 lists Maria + John, each with Attending/Not-attending (named-only group).
- Enter `Chris Stanish` → lists Chris + an open "Guest" slot with a name input + Guest checkbox (with-slot group).
- Enter `Honey Kostyn` → lists all 6 members incl. one open slot (large group).
- Enter `Christian` with blank last name → matches `afriend10` (last-name-optional).
- Enter `Nobody Here` → "couldn't find that name" error, stays on step 1.
- Submit a party → immediately shows "Thank you!" (optimistic). With the fixture there's no valid backend token, so the background write will fail and the form reappears with the submit error — that confirms the error path. Against the real deployed API (real token) it stays on "Thank you!".

- [ ] **Step 5: Commit**

```bash
git add rsvp/index.html rsvp/styles.css rsvp/index.js
git commit -m "Add two-step party RSVP page"
```

---

## Task 9: Schedule page

**Files:**
- Create: `schedule/index.html`, `schedule/styles.css`

**Interfaces:**
- Consumes: `/styles/root.css`, `/site.js`.

- [ ] **Step 1: Create `schedule/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Andy & Sam">
    <meta name="description" content="Andy & Sam's digital wedding invitation site">
    <meta name="theme-color" content="black">
    <meta name="robots" content="nofollow, noindex">
    <title>Schedule — Andy & Sam's Wedding</title>
    <link rel="stylesheet" href="/schedule/styles.css">
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <script>if (!localStorage.getItem('token')) location.replace('/')</script>
</head>
<body>
<h1>Andy &amp; Sam's Wedding</h1>
<div id="site-nav"></div>
<main>
    <section>
        <h2>Friday, October 16, 2026 — Rehearsal Dinner</h2>
        <p>If you will be in town on Friday evening and would like to join us,
            please RSVP for our rehearsal dinner.</p>
        <p class="tbd">time / place — TBD</p>
    </section>
    <section>
        <h2>Saturday, October 17, 2026 — Wedding Day</h2>
        <p>The Madison Hotel<br>Morristown, NJ</p>
        <p class="tbd">Ceremony — TBD<br>Cocktail hour — TBD<br>Reception — TBD</p>
    </section>
    <section>
        <h2>Sunday, October 18, 2026 — Brunch</h2>
        <p>If you are on site with us Sunday morning and would like to attend,
            please RSVP for our brunch.</p>
        <p class="tbd">time / place — TBD</p>
    </section>
</main>
<script src="/site.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `schedule/styles.css`**

```css
@import "/styles/root.css";

main {
    border: 4px solid var(--body-text-color);
    border-radius: 1vh;
    background-color: rgba(0, 0, 0, 0.75);
    width: 70vw;
    max-width: 50rem;
    text-align: center;
    padding: 2vh 4vw;
}
main section { margin: 2.5vh 0; }
h2 { font-family: nickerbocker, serif; font-weight: normal; }
.tbd { opacity: 0.7; font-style: italic; }
```

- [ ] **Step 3: Verify (manual)**

Run server, `localStorage.setItem('token','test')`, open `/schedule/`. Confirm three dated sections with SCHEDULE highlighted in the nav, dates exactly Fri Oct 16 / Sat Oct 17 / Sun Oct 18 2026.

- [ ] **Step 4: Commit**

```bash
git add schedule/index.html schedule/styles.css
git commit -m "Add schedule page"
```

---

## Task 10: Travel page

**Files:**
- Create: `travel/index.html`, `travel/styles.css`

- [ ] **Step 1: Create `travel/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Andy & Sam">
    <meta name="description" content="Andy & Sam's digital wedding invitation site">
    <meta name="theme-color" content="black">
    <meta name="robots" content="nofollow, noindex">
    <title>Travel — Andy & Sam's Wedding</title>
    <link rel="stylesheet" href="/travel/styles.css">
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <script>if (!localStorage.getItem('token')) location.replace('/')</script>
</head>
<body>
<h1>Andy &amp; Sam's Wedding</h1>
<div id="site-nav"></div>
<main>
    <p>Our wedding is taking place at The Madison Hotel in Morristown, NJ.
        If you'd like to stay on site:</p>
    <p class="tbd">room block info — TBD</p>

    <h2>Other hotels in the area</h2>
    <p class="tbd">list a few nearby hotels — TBD</p>

    <h2>Getting here</h2>
    <p>Newark (EWR) is the nearest airport to Morristown, NJ.
        From the airport, you can travel to Morristown by rideshare or NJ Transit.</p>
    <p class="tbd">most direct NJ Transit route — TBD</p>
</main>
<script src="/site.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `travel/styles.css`**

```css
@import "/styles/root.css";

main {
    border: 4px solid var(--body-text-color);
    border-radius: 1vh;
    background-color: rgba(0, 0, 0, 0.75);
    width: 70vw;
    max-width: 50rem;
    text-align: center;
    padding: 2vh 4vw;
}
h2 { font-family: nickerbocker, serif; font-weight: normal; margin-top: 2.5vh; }
.tbd { opacity: 0.7; font-style: italic; }
```

- [ ] **Step 3: Verify (manual)**

Run server, set token, open `/travel/`. Confirm venue/airport copy renders, TRAVEL highlighted in nav.

- [ ] **Step 4: Commit**

```bash
git add travel/index.html travel/styles.css
git commit -m "Add travel page"
```

---

## Task 11: FAQ page

**Files:**
- Create: `faq/index.html`, `faq/styles.css`

- [ ] **Step 1: Create `faq/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Andy & Sam">
    <meta name="description" content="Andy & Sam's digital wedding invitation site">
    <meta name="theme-color" content="black">
    <meta name="robots" content="nofollow, noindex">
    <title>FAQ — Andy & Sam's Wedding</title>
    <link rel="stylesheet" href="/faq/styles.css">
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <script>if (!localStorage.getItem('token')) location.replace('/')</script>
</head>
<body>
<h1>Andy &amp; Sam's Wedding</h1>
<div id="site-nav"></div>
<main>
    <dl>
        <dt>RSVP deadline</dt><dd class="tbd">TBD</dd>
        <dt>What time should I arrive?</dt><dd class="tbd">TBD</dd>
        <dt>Gifts / registry</dt><dd class="tbd">TBD</dd>
        <dt>Are children welcome?</dt><dd class="tbd">TBD</dd>
        <dt>Dress code / aesthetic</dt><dd class="tbd">TBD</dd>
        <dt>Can I take pictures/videos?</dt><dd class="tbd">TBD</dd>
        <dt>Dietary options</dt><dd class="tbd">TBD</dd>
        <dt>Weather — indoor or outdoor?</dt><dd class="tbd">TBD</dd>
        <dt>Parking / accessibility</dt><dd class="tbd">TBD</dd>
        <dt>How do I contact you with other questions?</dt><dd class="tbd">TBD</dd>
    </dl>
</main>
<script src="/site.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `faq/styles.css`**

```css
@import "/styles/root.css";

main {
    border: 4px solid var(--body-text-color);
    border-radius: 1vh;
    background-color: rgba(0, 0, 0, 0.75);
    width: 70vw;
    max-width: 50rem;
    text-align: left;
    padding: 2vh 4vw;
}
dt { font-family: nickerbocker, serif; margin-top: 1.2rem; }
dd { margin: 0.2rem 0 0; }
.tbd { opacity: 0.7; font-style: italic; }
```

- [ ] **Step 3: Verify (manual)**

Run server, set token, open `/faq/`. Confirm the question list renders with FAQ highlighted in the nav.

- [ ] **Step 4: Commit**

```bash
git add faq/index.html faq/styles.css
git commit -m "Add FAQ page"
```

---

## Task 12: Retire save-the-date + full-site verification

**Files:**
- Delete: `savethedate/` (directory)
- Modify: `README.md` (reflect the new page set and RSVP flow)

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Remove the old save-the-date page**

Run: `git rm -r savethedate`
Expected: `savethedate/index.html`, `savethedate/styles.css`, `savethedate/index.js` removed.

- [ ] **Step 2: Update README**

In `README.md`, replace the pages/flow description so it documents: the gate, the 5 pages (Home, RSVP, Schedule, Travel, FAQ), the `GUESTS`/`PUT` API contract, and the guest-list generator (`tools/gen-guests.mjs`). Remove references to `savethedate`.

- [ ] **Step 3: Full-site manual pass against the real API**

Run: `python3 -m http.server 8000`. Clear storage (DevTools → Application → Clear site data). Open `http://localhost:8000/`:
1. Submit a correct last name → lands on `/home/`; `localStorage.token` + `sessionStorage.guests` set.
2. Click through HOME → RSVP → SCHEDULE → TRAVEL → FAQ; each highlights its nav item; mobile MENU drawer works at < 700px.
3. On `/rsvp/`, enter a real name from the list, toggle attendance, submit → "Thank you!" stays (real token → background write succeeds); confirm a new row in the RSVP sheet.
4. Open `/home/` in a fresh private window with no token → redirected to `/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Retire save-the-date page and update README"
```

---

## Self-Review

**Spec coverage:**
- Gate stays in front, redirect `/home/` → Tasks 5, 6. ✓
- Guest list in-code, token-gated, prefetched + cached → Tasks 4, 5, 6, 8. ✓
- Optimistic write, drop token rotation → Task 5 (`rsvp()`, `tokenIsValid`), Task 8. ✓
- Art-deco gold visual + 3 new fonts → Tasks 1, 2, 3. ✓
- 5 pages (Home, RSVP, Schedule, Travel, FAQ), no wedding-party page → Tasks 7–11. ✓
- Shared nav via `site.js` + token guard → Task 3, inline head guard on each page. ✓
- Party RSVP w/ named members + open guest slots + last-name-optional → Task 8 (`findGroup`, `renderParty`, fixture cases). ✓
- Dates Fri 10/16 / Sat 10/17 / Sun 10/18 2026 → Task 9, Global Constraints. ✓
- Optimize backgrounds < 200KB, fonts < 80KB → Tasks 1, 2. ✓
- Retire save-the-date → Task 12. ✓

**Placeholder scan:** Content `TBD`s on Schedule/Travel/FAQ are intentional, user-facing placeholders for the couple to fill (per spec §5), not plan placeholders — every step has concrete code/commands. The hero photo is an explicitly-generated placeholder image the couple replaces.

**Type consistency:** `GUESTS` shape `{group:[{first,last,slot}]}` is identical across generator (Task 4), API (Task 5), prefetch (Task 6), and consumer (Task 8). `responses` shape `[{first,last,attending,isGuest}]` matches between Task 8 (sender) and Task 5 (`rsvp()` writer). `tokenIsValid` defined and used within Task 5. Nav element id `site-nav` consistent between `site.js` (Task 3) and every page.
