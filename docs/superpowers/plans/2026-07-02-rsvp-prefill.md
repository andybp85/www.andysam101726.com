# RSVP Prefill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Returning guests on `/rsvp/` see a banner acknowledging their earlier RSVP and get the form prefilled with their last answers, editable and resubmittable until the deadline.

**Architecture:** The Apps Script `GUESTS` verb gains a `responses` field — each party's latest submission derived from the append-only RSVP sheet (rows sharing the group's max timestamp). The frontend caches `{guests, responses}` per session, maps prior rows to members positionally via a pure `prefillPlan` helper, and writes the cache through after a successful resubmit. Spec: `docs/superpowers/specs/2026-07-02-rsvp-prefill-design.md`.

**Tech Stack:** Vanilla ES modules, node:test, Playwright (stubbed API), Google Apps Script via clasp.

## Global Constraints

- No build step, no runtime deps; root-relative import paths (`/api.js`).
- JS style: no semicolons, single-param arrows without parens, const-first, alphabetized object properties.
- 4-space indent. Banner copy verbatim: `It looks like you've already RSVP'd! If anything's changed, update your response below and resubmit by September 26th, 2026.`
- `new_design/` (incl. `apps-script/`) is gitignored — never `git add` it.
- Backend deploys to the EXISTING deployment id `AKfycbwfXZMR_HIAoBzBZaS6bpmgB-pNZRkrjxRn6Bq09__brkhYBJNZUaGrMnPYkYDDoqdiqQ` so the `/exec` URL is unchanged.
- Commits end with the Co-Authored-By + Claude-Session trailer used by this session's prior commits.

---

### Task 1: `prefillPlan` pure helper

**Files:**
- Modify: `rsvp/party.js` (append)
- Test: `tests/party.test.js` (append)

**Interfaces:**
- Consumes: nothing new. Member shape `{first, last, slot}`; response row shape `{attending, first, isGuest, last}` (as returned by the API and as built by the submit handler).
- Produces: `prefillPlan(members, prior)` → `undefined` when `prior` is missing or `prior.length !== members.length`; otherwise an array aligned to `members`: `{attending: boolean}` for named members, `{declined: boolean, name: string}` for slot members (name is `first + ' ' + last` trimmed when attending, `''` when declined).

- [ ] **Step 1: Write the failing tests** — append to `tests/party.test.js` (it already imports `test`/`assert` and `partiesByLastName` from `../rsvp/party.js`; extend the import to include `prefillPlan`):

```js
const named = { first: 'Ann', last: 'Lee', slot: false }
const slot = { first: '', last: '', slot: true }

test('prefillPlan maps named members to their saved attending answer', () => {
    const plan = prefillPlan([named, named], [
        { attending: true, first: 'Ann', isGuest: false, last: 'Lee' },
        { attending: false, first: 'Bob', isGuest: false, last: 'Lee' },
    ])
    assert.deepEqual(plan, [{ attending: true }, { attending: false }])
})

test('prefillPlan fills an attending guest slot with the saved name', () => {
    const plan = prefillPlan([slot], [{ attending: true, first: 'Jo', isGuest: true, last: 'March' }])
    assert.deepEqual(plan, [{ declined: false, name: 'Jo March' }])
})

test('prefillPlan marks a declined guest slot and leaves the name empty', () => {
    const plan = prefillPlan([slot], [{ attending: false, first: 'Guest', isGuest: true, last: '' }])
    assert.deepEqual(plan, [{ declined: true, name: '' }])
})

test('prefillPlan returns undefined without prior responses or on count mismatch', () => {
    assert.equal(prefillPlan([named], undefined), undefined)
    assert.equal(prefillPlan([named, slot], [{ attending: true, first: 'A', isGuest: false, last: 'B' }]), undefined)
})
```

- [ ] **Step 2: Run to verify failure** — `npm test`. Expected: the new tests FAIL (`prefillPlan` is not exported).

- [ ] **Step 3: Implement** — append to `rsvp/party.js`:

```js
// Prefill plan for a party's form from its latest saved responses: one entry
// per member — {attending} for named members, {declined, name} for open +1
// slots. PUT writes rows in member order, so the mapping is positional (which
// survives guest-list name corrections). Returns undefined when there is
// nothing to prefill or the party changed shape since the RSVP (count
// mismatch) — the caller falls back to the default form.
export function prefillPlan(members, prior) {
    if (!prior || prior.length !== members.length) return undefined
    return members.map((m, i) => m.slot
        ? {
            declined: !prior[i].attending,
            name: prior[i].attending ? `${prior[i].first} ${prior[i].last}`.trim() : '',
        }
        : { attending: prior[i].attending })
}
```

- [ ] **Step 4: Run to verify pass** — `npm test`. Expected: all unit tests pass (14 existing + 4 new = 18).

- [ ] **Step 5: Commit**

```bash
git add rsvp/party.js tests/party.test.js
git commit -m "RSVP: prefillPlan maps a party's saved responses onto its form"
```

---

### Task 2: Frontend — banner, prefill, session cache with write-through

**Files:**
- Modify: `rsvp/index.html` (banner element)
- Modify: `rsvp/index.js` (cache shape, renderParty prefill, write-through)
- Test: `tests/browser/rsvp.spec.js`

**Interfaces:**
- Consumes: `prefillPlan(members, prior)` from Task 1 (via the existing `./party.js` import); API `GUESTS` reply optionally carrying `responses: {groupId: row[]}` (absent until Task 3 deploys — code must tolerate `undefined` via `?? {}`).
- Produces: sessionStorage key `guestData` = `{guests, responses}` (replaces the `guests` key, which is no longer read or written).

- [ ] **Step 1: Write the failing browser tests** — in `tests/browser/rsvp.spec.js`, add a `responses` field to the stub and two tests. Change the existing `reply` line to:

```js
const RESPONSES = {
    '2': [{ attending: false, first: 'Pat', isGuest: false, last: 'Harber' }],
}
const reply = { guests: GUESTS, responses: RESPONSES, status: 'success' }
```

Append the tests:

```js
test('a party that already RSVP\'d sees the banner and their saved answers', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Harber')
    await page.click('#name-form button[type="submit"]')
    await page.locator('#step-pick .party-pick').nth(1).click()   // Pat, group '2'

    await expect(page.locator('#already-rsvpd')).toBeVisible()
    await expect(page.locator('input[name="att-0"][value="no"]')).toBeChecked()
})

test('a party without a prior RSVP gets the default form and no banner', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Stanish')
    await page.click('#name-form button[type="submit"]')

    await expect(page.locator('#already-rsvpd')).toBeHidden()
    await expect(page.locator('input[name="att-0"][value="yes"]')).toBeChecked()
})
```

- [ ] **Step 2: Run to verify failure** — `npm run test:browser`. Expected: both new tests FAIL (`#already-rsvpd` does not exist).

- [ ] **Step 3: Add the banner element** — in `rsvp/index.html`, inside `<section id="step-party" hidden>`, directly after the `<h2 class="rsvp-title">RSVP</h2>` line:

```html
<p id="already-rsvpd" class="deadline" hidden>It looks like you've already
    RSVP'd! If anything's changed, update your response below and resubmit
    by September&nbsp;26<sup>th</sup>,&nbsp;2026.</p>
```

- [ ] **Step 4: Rework `rsvp/index.js`** — three changes:

(a) Replace `fetchGuests`/`getGuests`/warm-up block (keeps the memoized warm-up added earlier) with:

```js
async function fetchGuestData() {
    const cached = sessionStorage.getItem('guestData')
    if (cached) {
        try {
            return JSON.parse(cached)
        } catch (e) {
            sessionStorage.removeItem('guestData')
        }
    }
    const r = await postForm({token: localStorage.getItem('token'), VERB: 'GUESTS'})
    if (r.status !== 'success') throw new Error('Could not load the guest list. Please try again.')
    const data = {guests: r.guests, responses: r.responses ?? {}}
    sessionStorage.setItem('guestData', JSON.stringify(data))
    return data
}

// Memoized so the on-load warm-up below and the submit handler share one fetch.
let guestDataPromise
const getGuestData = () => guestDataPromise ??= fetchGuestData()

// Warm the cache while the visitor types their name; on failure, reset so the
// submit handler retries and surfaces the error.
getGuestData().catch(() => guestDataPromise = undefined)
```

(b) `renderParty` takes the party's prior responses, toggles the banner, and applies the plan after building the rows (import `prefillPlan` alongside the existing `./party.js` imports). Replace the current `renderParty` with:

```js
function renderParty(group, prior) {
    $('already-rsvpd').hidden = !prior
    $('members').innerHTML = group.members.map(memberRow).join('')
    // Saved answers, mapped positionally onto the fresh rows (undefined → defaults).
    const plan = prefillPlan(group.members, prior)
    for (const [i, p] of (plan ?? []).entries()) {
        const fs = $('members').querySelector(`.member[data-i="${i}"]`)
        if (p.attending === undefined) {
            fs.querySelector('.guest-name').value = p.name
            fs.querySelector('.guest-decline').checked = p.declined
        } else
            fs.querySelector(`input[name="att-${i}"][value="${p.attending ? 'yes' : 'no'}"]`).checked = true
    }
    // Guest slots: a name and "not attending" are alternatives — keep them in sync.
    for (const fs of $('members').querySelectorAll('.member')) {
        const name = fs.querySelector('.guest-name')
        if (!name) continue
        const decline = fs.querySelector('.guest-decline')
        name.addEventListener('input', () => name.value.trim() && (decline.checked = false))
        decline.addEventListener('change', () => decline.checked && (name.value = ''))
    }
}
```

In the name-form submit handler, destructure and thread `responses` through both call sites:

```js
const {guests, responses} = await getGuestData()
```

…and change both `renderParty(matchedGroup)` calls to `renderParty(matchedGroup, responses[matchedGroup.id])` / `renderParty(p, responses[p.id])` (inside the picker button handler, using its `p`; also set `matchedGroup = p` as today).

(c) Write-through after a successful `PUT` — inside the party-form submit `try`, after the `ensureOk` await and before revealing the thanks step:

```js
        // Write-through so a reload this session prefills the just-saved answers.
        try {
            const data = JSON.parse(sessionStorage.getItem('guestData'))
            data.responses[matchedGroup.id] = responses
            sessionStorage.setItem('guestData', JSON.stringify(data))
        } catch (e) {
            sessionStorage.removeItem('guestData')
        }
        guestDataPromise = undefined   // drop the memo; next lookup re-reads storage
```

- [ ] **Step 5: Run to verify pass** — `npm run test:browser`. Expected: all browser tests pass (3 existing + 2 new = 5 in rsvp.spec plus gate/nav = 12 total).

- [ ] **Step 6: Run the unit suite too** — `npm test`. Expected: 18 pass.

- [ ] **Step 7: Commit**

```bash
git add rsvp/index.html rsvp/index.js tests/browser/rsvp.spec.js
git commit -m "RSVP: banner + prefilled form for parties that already responded"
```

---

### Task 3: Backend — `responses` in the GUESTS reply; deploy and verify live

**Files:**
- Modify: `new_design/apps-script/Code.js` (NOT committed to git — gitignored; Google is its VCS)

**Interfaces:**
- Consumes: RSVP sheet rows `[ts, group, first, last, 'yes'|'no', 'guest'|'']` (written by `rsvp()`); `rsvpSheetId` from `secret.js`.
- Produces: `GUESTS` reply field `responses: {groupId: [{attending, first, isGuest, last}]}` — the contract Task 2 consumes.

- [ ] **Step 1: Edit `Code.js`** — replace the `guests` function and add `latestResponses` below it:

```js
// verb: GUESTS — token-gated guest list + each party's latest RSVP responses
function guests(contents) {
    if (!tokenIsValid(contents.token))
        return respond({status: 'unauthorized', message: 'invalid token'})
    return respond({status: 'success', guests: GUESTS, responses: latestResponses()})
}

// Latest submission per group from the append-only RSVP sheet. rsvp() writes
// one row per member, all sharing a single Date.now(), so a group's latest
// submission is exactly its rows carrying the group's max timestamp, in
// written order. Rows: [ts, group, first, last, 'yes'|'no', 'guest'|''].
function latestResponses() {
    const sheet = SpreadsheetApp.openById(rsvpSheetId)
    sheet.setActiveSheet(sheet.getSheets()[0])
    const latest = {}
    for (const [ts, group, first, last, att, flag] of sheet.getDataRange().getValues()) {
        if (!group || typeof ts !== 'number') continue
        if (!latest[group] || ts > latest[group].ts) latest[group] = {rows: [], ts}
        if (ts === latest[group].ts)
            latest[group].rows.push({attending: att === 'yes', first, isGuest: flag === 'guest', last})
    }
    const responses = {}
    for (const group in latest) responses[group] = latest[group].rows
    return responses
}
```

- [ ] **Step 2: Push and deploy to the existing deployment**

```bash
cd new_design/apps-script
clasp push
clasp deploy -i AKfycbwfXZMR_HIAoBzBZaS6bpmgB-pNZRkrjxRn6Bq09__brkhYBJNZUaGrMnPYkYDDoqdiqQ -d "GUESTS returns latest responses per group"
```

Expected: push lists the project files; deploy prints the same deployment id with a new version number.

- [ ] **Step 3: Verify live** — two-step curl (Apps Script 302s to a one-shot echo URL; `curl -L` breaks it):

```bash
URL='https://script.google.com/macros/s/AKfycbwfXZMR_HIAoBzBZaS6bpmgB-pNZRkrjxRn6Bq09__brkhYBJNZUaGrMnPYkYDDoqdiqQ/exec'
LOC=$(curl -s -o /dev/null -X POST "$URL" --data-urlencode 'VERB=POST' --data-urlencode 'password=Stanish' -D - | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
TOKEN=$(curl -s -A 'Mozilla/5.0' "$LOC" | python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')
LOC2=$(curl -s -o /dev/null -X POST "$URL" --data-urlencode 'VERB=GUESTS' --data-urlencode "token=$TOKEN" -D - | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
curl -s -A 'Mozilla/5.0' "$LOC2" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d["status"], "guests:", len(d.get("guests",{})), "responses:", len(d.get("responses",{})))'
```

Expected: `success guests: 93 responses: <N>` where N ≥ 1 (real RSVPs and/or the old smoke-test row). Do NOT print the response contents (guest PII).

- [ ] **Step 4: Full local suites once more** — `npm test && npm run test:browser`. Expected: 18 unit + 12 browser pass (frontend still stubs the API; this catches accidental local edits).

- [ ] **Step 5: Close out** — no git commit for `Code.js` (gitignored). Update the feature bean's todos and mark it completed with a Summary of Changes; commit the bean file:

```bash
git add .beans/www.andysamwedding.com-cbzq*
git commit -m "Bean: RSVP prefill shipped"
```
