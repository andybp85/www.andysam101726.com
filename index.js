import { postForm } from '/api.js'

const loginForm = document.forms['login']
const submitButton = document.forms['login']['submit-button']

loginForm.addEventListener('submit', e => {
    e.preventDefault()
    submitButton.classList.add('submitting')

    postForm(new FormData(e.target))
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
        const r = await postForm({VERB: 'GUESTS', token})
        if (r.status === 'success')
            sessionStorage.setItem('guests', JSON.stringify(r.guests))
    } catch (err) {
        console.warn('guest prefetch failed; rsvp page will fetch on demand', err)
    }
}
