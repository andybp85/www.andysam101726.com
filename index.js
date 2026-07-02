import { postForm, ensureOk } from '/api.js'

const loginForm = document.forms['login']
const submitButton = loginForm['submit-button']

loginForm.addEventListener('submit', e => {
    e.preventDefault()
    submitButton.classList.add('submitting')

    postForm(new FormData(e.target))
        .then(ensureOk)
        .then(r => {
            localStorage.setItem('token', r.token)
            localStorage.setItem('redirect', r.redirect)
            // No guest prefetch here: it doubled login latency, and the rsvp
            // page warms its own cache on load.
            window.location = r.redirect
        })
        .catch(e => {
            document.getElementById('error-msg').innerText = e.message
            console.error(e)
        })
        .finally(() => submitButton.classList.remove('submitting'))
})
