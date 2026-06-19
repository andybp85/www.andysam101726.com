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

// Mirror the CSS :user-invalid state onto aria-invalid so assistive tech gets
// the same interaction-timed feedback sighted users see.
function syncInvalid(el) {
    if (!el.matches || !el.matches('input, textarea, select')) return
    if (el.matches(':user-invalid')) el.setAttribute('aria-invalid', 'true')
    else el.removeAttribute('aria-invalid')
}

document.addEventListener('blur', e => syncInvalid(e.target), true)
document.addEventListener('input', e => syncInvalid(e.target))
