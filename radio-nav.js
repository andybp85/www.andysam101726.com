import { angleFromStation, stationFromAngle, angleFromPointer } from './radio-math.js'

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
            <button id="knob" type="button" aria-label="Navigation — tune the dial, or open the menu" aria-controls="station-menu" aria-expanded="false"><span class="knob-spin"><span class="knob-arrow"><svg viewBox="0 0 103.73 40.77" aria-hidden="true"><path d="M103.73,18.69 L2.58,0 c-1.34,-0.25 -2.58,0.78 -2.58,2.14 v36.49 c0,1.36 1.24,2.39 2.58,2.14 L103.73,22.08 c1.89,-0.35 1.89,-3.05 0,-3.4 z"/></svg></span></span><span class="knob-label">MENU</span></button>
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
function positionNeedle(i) {
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
    positionNeedle(i)
}

function initDesktopKnob() {
    const knob = document.getElementById('knob')
    if (!knob) return
    let dragging = false, target = currentIndex()
    // Track the knob's current angle so the dead zone can act as a hard stop.
    let lastDeg = angleFromStation(target, NAV.length)
    // Initial orientation: no spin-on-load.
    setNeedle(target, false)
    const onMove = e => {
        if (!dragging) return
        const r = knob.getBoundingClientRect()
        const raw = angleFromPointer(r.left + r.width / 2, r.top + r.height / 2, e.clientX, e.clientY)
        // The 90° wedge past FAQ (MAX_ANGLE..360, the dial's bottom-left) is the
        // dead zone. Treat it as a hard stop: when the pointer strays in there,
        // hold the knob at whichever end it's already nearest instead of letting
        // it snap across the dead zone (HOME<->FAQ). Inside the range it tracks
        // the finger 1:1.
        let deg
        if (raw <= MAX_ANGLE) {
            deg = raw
        } else {
            deg = lastDeg >= MAX_ANGLE / 2 ? MAX_ANGLE : 0
        }
        lastDeg = deg
        target = stationFromAngle(deg, NAV.length)
        // Knob follows the finger continuously; the needle snaps to the nearest
        // station (its own CSS-eased `left`).
        rotateKnob(deg, false)
        positionNeedle(target)
    }
    knob.addEventListener('pointerdown', e => {
        if (window.matchMedia('(max-width: 700px)').matches) return
        dragging = true
        // Resume the hard-stop logic from the knob's current resting angle.
        lastDeg = angleFromStation(target, NAV.length)
        knob.setPointerCapture(e.pointerId)
    })
    knob.addEventListener('pointermove', onMove)
    knob.addEventListener('pointerup', () => {
        if (!dragging) return
        dragging = false
        // Ease the knob onto the exact station angle, then navigate.
        setNeedle(target, true)
        go(NAV[target][1])
    })
}

function initMobileKnob() {
    const knob = document.getElementById('knob')
    const menu = document.getElementById('station-menu')
    if (!knob || !menu) return
    knob.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 700px)').matches) {
            // Push-drawer: slide the whole page right to reveal the left menu
            const open = document.body.classList.toggle('menu-open')
            knob.setAttribute('aria-expanded', String(open))
        }
    })
}

window.addEventListener('resize', () => positionNeedle(currentIndex()))
document.fonts.ready.then(() => positionNeedle(currentIndex()))

initDesktopKnob()
initMobileKnob()
