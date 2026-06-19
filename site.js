// Mirror the CSS :user-invalid state onto aria-invalid so assistive tech gets
// the same interaction-timed feedback sighted users see.
function syncInvalid(el) {
    if (!el.matches || !el.matches('input, textarea, select')) return
    if (el.matches(':user-invalid')) el.setAttribute('aria-invalid', 'true')
    else el.removeAttribute('aria-invalid')
}

document.addEventListener('blur', e => syncInvalid(e.target), true)
document.addEventListener('input', e => syncInvalid(e.target))
