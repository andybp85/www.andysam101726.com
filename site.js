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
