import { angleFromStation, stationFromAngle, angleFromPointer } from './radio-math.js'

const NAV = [
    {href: '/home/', label: 'HOME'},
    {href: '/rsvp/', label: 'RSVP'},
    {href: '/schedule/', label: 'SCHEDULE'},
    {href: '/travel/', label: 'TRAVEL'},
    {href: '/faq/', label: 'FAQ'},
]

function currentIndex() {
    const here = location.pathname
    const i = NAV.findIndex(({href}) => here === href || here === href.slice(0, -1))
    return i < 0 ? 0 : i
}

// Tooltips are a desktop affair — on mobile the knob is just the MENU toggle.
const isPhone = () => window.matchMedia('(max-width: 700px)').matches
// localStorage flag so the "Spin me!" onboarding bubble shows once, ever.
const SPIN_TIP_SEEN = 'andysam:knob-tip-seen'

// Free-floating cream/brass bubble (position: fixed, placed in JS). Appended to
// <body> so no ancestor overflow can clip it.
function makeTip(extraClass) {
    const el = document.createElement('div')
    el.className = 'knob-tip ' + extraClass
    el.setAttribute('role', 'tooltip')
    el.hidden = true
    document.body.appendChild(el)
    return el
}

function render() {
    const stations = NAV.map(({href, label}, i) =>
        `<a class="station" data-index="${i}" href="${href}">${label}</a>`).join('')
    document.getElementById('site-nav').innerHTML = `
        <div id="radio">
            <button id="knob" type="button" aria-controls="station-menu" aria-expanded="false"
                    aria-label="Navigation — tune the dial, or open the menu"><span
                    class="knob-spin"><span class="knob-arrow"><svg viewBox="0 0 103.73 40.77"
                    aria-hidden="true"><path d="M103.73,18.69 L2.58,0 c-1.34,-0.25 -2.58,0.78 -2.58,2.14
                    v36.49 c0,1.36 1.24,2.39 2.58,2.14 L103.73,22.08 c1.89,-0.35 1.89,-3.05 0,-3.4
                    z"/></svg></span></span><span class="knob-label">MENU</span></button>
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
    requestAnimationFrame(() => positionNeedle(i))
}

// Position the needle over the active station in the desktop dial.
// Reads the bounding rects after layout; no-ops if #dial is hidden (mobile).
// `animate` eases the slide (true while the user is tuning the knob); off snaps
// instantly — so on load, font swap, and resize the needle is already resting on
// its station, the way a real dial is when you switch the radio on, instead of
// sweeping in from the default position.
function positionNeedle(i, animate = false) {
    const needle = document.getElementById('needle')
    const dial = document.getElementById('dial')
    if (!needle || !dial) return
    // Find the active station anchor inside #dial > #stations (not #station-menu)
    const stationEl = dial.querySelector(`#stations .station[data-index="${i}"]`)
    if (!stationEl) return
    const dialRect = dial.getBoundingClientRect()
    const stRect = stationEl.getBoundingClientRect()
    // The needle is absolutely positioned against the dial's padding box, but
    // getBoundingClientRect gives the border box — subtract the border width so
    // the red line lands exactly on the active station's tick.
    const borderLeft = parseFloat(getComputedStyle(dial).borderLeftWidth) || 0
    const relCenter = (stRect.left + stRect.width / 2) - dialRect.left - borderLeft
    needle.style.transition = animate ? '' : 'none'   // '' restores the CSS ease
    needle.style.left = relCenter + 'px'
}

render()

function go(href) { if (href !== location.pathname) location.href = href }

// Largest valid tuning angle (last station). Used to clamp the live drag so the
// knob never spins past the dial into the dead zone.
const MAX_ANGLE = angleFromStation(NAV.length - 1, NAV.length)

// Rotate only the knurled body + arrow; the glare overlay stays fixed.
// `animate` eases the turn (snapping to a station); off = follow the finger 1:1.
function rotateKnob(deg, animate) {
    const spin = document.querySelector('.knob-spin')
    if (!spin) return
    spin.style.transition = animate ? 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
    spin.style.transform = `rotate(${deg}deg)`
}

function setNeedle(i, animate = true) {
    rotateKnob(angleFromStation(i, NAV.length), animate)
    positionNeedle(i, animate)
}

function initDesktopKnob() {
    const knob = document.getElementById('knob')
    if (!knob) return
    let dragging = false, target = currentIndex()
    // Track the knob's current angle so the dead zone can act as a hard stop.
    let lastDeg = angleFromStation(target, NAV.length)
    // Initial orientation: no spin-on-load.
    setNeedle(target, false)
    // Resolve the dial angle under a pointer event, applying the dead-zone hard
    // stop. The 90° wedge past FAQ (MAX_ANGLE..360, the dial's bottom-left) is the
    // dead zone: when the pointer strays in there, hold whichever end the knob is
    // already nearest instead of snapping across it (HOME<->FAQ). Inside the range
    // it tracks the pointer 1:1.
    const degAt = e => {
        const r = knob.getBoundingClientRect()
        const raw = angleFromPointer(r.left + r.width / 2, r.top + r.height / 2, e.clientX, e.clientY)
        return raw <= MAX_ANGLE ? raw : lastDeg >= MAX_ANGLE / 2 ? MAX_ANGLE : 0
    }
    const onMove = e => {
        if (!dragging) return
        const deg = degAt(e)
        lastDeg = deg
        target = stationFromAngle(deg, NAV.length)
        // Knob follows the finger continuously; the needle snaps to the nearest
        // station (its own CSS-eased `left`).
        rotateKnob(deg, false)
        positionNeedle(target, true)
    }
    knob.addEventListener('pointerdown', e => {
        if (isPhone()) return
        dragging = true
        // Tune to wherever on the dial the knob was grabbed, so a plain click (no
        // drag) selects that station — matching the per-angle hover tooltip. The
        // knob turns absolutely to the pointer angle anyway, so this is no jump.
        const deg = degAt(e)
        lastDeg = deg
        target = stationFromAngle(deg, NAV.length)
        rotateKnob(deg, false)
        positionNeedle(target, true)
        knob.setPointerCapture(e.pointerId)
    })
    knob.addEventListener('pointermove', onMove)
    knob.addEventListener('pointerup', () => {
        if (!dragging) return
        dragging = false
        // Ease the knob onto the exact station angle, then navigate.
        setNeedle(target, true)
        go(NAV[target].href)
    })
    // A cancelled pointer (interrupted gesture, capture loss) must not leave the
    // drag armed — disarm and settle back on the current page's station, without
    // navigating. After a normal pointerup, dragging is already false → no-op.
    const cancelDrag = () => {
        if (!dragging) return
        dragging = false
        target = currentIndex()
        lastDeg = angleFromStation(target, NAV.length)
        setNeedle(target, true)
    }
    knob.addEventListener('pointercancel', cancelDrag)
    knob.addEventListener('lostpointercapture', cancelDrag)

    // Keyboard tuning, so the dial isn't pointer-only: arrows step one station,
    // Enter/Space visits the tuned station. Mobile keeps the default click
    // behavior (menu toggle) instead.
    knob.addEventListener('keydown', e => {
        if (isPhone()) return
        const step = {ArrowDown: 1, ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1}[e.key]
        if (step) {
            e.preventDefault()
            target = Math.max(0, Math.min(NAV.length - 1, target + step))
            lastDeg = angleFromStation(target, NAV.length)
            setNeedle(target, true)
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            go(NAV[target].href)
        }
    })

    // Hover tooltip — names the station the knob would tune to at the pointer, so
    // each clickable wedge advertises its destination. Follows the cursor.
    const hoverTip = makeTip('knob-tip--hover')
    knob.addEventListener('pointermove', e => {
        if (isPhone() || dragging) return
        hoverTip.textContent = NAV[stationFromAngle(degAt(e), NAV.length)].label
        hoverTip.style.left = e.clientX + 'px'
        hoverTip.style.top = e.clientY + 'px'
        hoverTip.hidden = false
    })
    const hideHover = () => hoverTip.hidden = true
    knob.addEventListener('pointerleave', hideHover)
    knob.addEventListener('pointerdown', hideHover)
}

// First-visit onboarding bubble under the knob: "Spin me!". Shows once (ever) on
// desktop, then closes on the first interaction of any kind — including scroll.
function initSpinTip() {
    if (isPhone() || localStorage.getItem(SPIN_TIP_SEEN)) return
    const knob = document.getElementById('knob')
    if (!knob) return
    const tip = makeTip('knob-tip--spin')
    tip.textContent = 'Spin me!'
    const place = () => {
        const r = knob.getBoundingClientRect()
        tip.style.left = r.left + r.width / 2 + 'px'
        tip.style.top = r.top - 12 + 'px'
    }
    place()
    tip.hidden = false
    localStorage.setItem(SPIN_TIP_SEEN, '1')   // first visit only

    const ac = new AbortController()
    const opts = { signal: ac.signal }
    const dismiss = () => { tip.hidden = true; ac.abort() }
    // Capture-phase scroll catches nested scrollers too; the rest cover click,
    // wheel, keyboard, touch, and engaging the knob itself.
    window.addEventListener('scroll', dismiss, { capture: true, passive: true, signal: ac.signal })
    for (const t of ['wheel', 'pointerdown', 'keydown', 'touchstart']) window.addEventListener(t, dismiss, opts)
    knob.addEventListener('pointerenter', dismiss, opts)
    // Keep it pinned to the knob if the layout reflows while it's still up.
    window.addEventListener('resize', place, opts)
}

function initMobileKnob() {
    const knob = document.getElementById('knob')
    const menu = document.getElementById('station-menu')
    if (!knob || !menu) return
    knob.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 700px)').matches) {
            // Toggle the overlay drawer (slides in over the page content)
            const open = document.body.classList.toggle('menu-open')
            knob.setAttribute('aria-expanded', String(open))
        }
    })
}

window.addEventListener('resize', () => positionNeedle(currentIndex()))
document.fonts.ready.then(() => { positionNeedle(currentIndex()); initSpinTip() })

initDesktopKnob()
initMobileKnob()
