const loginForm = document.forms['login']
const submitButton = document.forms['login']['submit-button']

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

// Mirror the CSS :user-invalid state onto aria-invalid for assistive tech.
function syncInvalid(el) {
    if (!el.matches || !el.matches('input, textarea, select')) return
    if (el.matches(':user-invalid')) el.setAttribute('aria-invalid', 'true')
    else el.removeAttribute('aria-invalid')
}

document.addEventListener('blur', e => syncInvalid(e.target), true)
document.addEventListener('input', e => syncInvalid(e.target))

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
