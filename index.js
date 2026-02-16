const loginForm = document.forms['login']
const submitButton = document.forms['login']['submit-button']

loginForm.addEventListener('submit', e => {
    e.preventDefault()
    submitButton.classList.add('submitting')
    const formData = new FormData(e.target)

    fetch('https://script.google.com/macros/s/AKfycbzlDfJdr-lTdTmOuNGXMYS-53jjXf1QCW_dD_I6ZmLYRSO_Y7UCgzcGertCfHIT5nbx/exec', {
        method: 'POST',
        body: formData
    }).then(r => r.json())
        .then(r => {
            if (r.status === 'success') {
                localStorage.setItem('token', r.token)
                localStorage.setItem('redirect', r.redirect)
                window.location = r.redirect
            } else
                throw new Error(r.message)
        })
        .catch(e => {
            document.getElementById('error-msg').innerText = e.message
            console.error(e)

        })
        .finally(() => submitButton.classList.remove('submitting'))
})
