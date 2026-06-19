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
            <button id="knob" type="button" aria-label="Tuning knob"><span class="knob-label">MENU</span></button>
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
    // Center the needle on the station's horizontal midpoint relative to the dial
    const relCenter = (stRect.left + stRect.width / 2) - dialRect.left
    needle.style.left = relCenter + 'px'
}

render()

function go(href) { if (href !== location.pathname) location.href = href }

function setNeedle(i) {
    const knob = document.getElementById('knob')
    if (knob) knob.style.transform = `rotate(${angleFromStation(i, NAV.length)}deg)`
    positionNeedle(i)
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
    knob.addEventListener('pointerdown', e => {
        if (window.matchMedia('(max-width: 700px)').matches) return
        dragging = true
        knob.setPointerCapture(e.pointerId)
    })
    knob.addEventListener('pointermove', onMove)
    knob.addEventListener('pointerup', () => {
        if (!dragging) return
        dragging = false
        go(NAV[target][1])
    })
}

function initMobileKnob() {
    const knob = document.getElementById('knob')
    const menu = document.getElementById('station-menu')
    if (!knob || !menu) return
    knob.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 700px)').matches) menu.classList.toggle('open')
    })
}

window.addEventListener('resize', () => positionNeedle(currentIndex()))
document.fonts.ready.then(() => positionNeedle(currentIndex()))

initDesktopKnob()
initMobileKnob()
