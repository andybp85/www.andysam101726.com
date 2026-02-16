// form switching
const changeForm = (attending) => {
    const isAttending = document.getElementById('is-attending-info')
    isAttending.classList[attending === 'yes' ? 'remove' : 'add']('disabled-fields')
    isAttending.querySelectorAll('input').forEach(i => {
        i.required = attending === 'yes'
        i.disabled = attending !== 'yes'
    })
    const notAttending = document.getElementById('not-attending-info')
    notAttending.classList[attending === 'no' ? 'remove' : 'add']('disabled-fields')
    notAttending.querySelectorAll('input').forEach(i => {
        i.required = attending === 'no'
        i.disabled = attending !== 'no'
    })
}

document.querySelectorAll('input[name=attending]')
    .forEach(x => {
        if (x.value === 'no' && x.checked) changeForm('no')
        x.addEventListener('change', ({target: {value: attending}}) => {
            changeForm(attending)
        })
    })

// resize inputs
function makeInputResize(input) {
    const originalElmWidth = parseInt(window.getComputedStyle(input).getPropertyValue('width'), 10)
    const measureWidthElm = document.createElement('div')
    measureWidthElm.style.visibility = 'hidden'
    measureWidthElm.style.position = 'absolute'
    measureWidthElm.style.bottom = '0'
    measureWidthElm.style.right = '0'
    measureWidthElm.style.fontFamily = window.getComputedStyle(input).getPropertyValue('font-family')

    document.body.appendChild(measureWidthElm)

    const resizeInput = () => {
        measureWidthElm.style.fontSize = window.getComputedStyle(input).getPropertyValue('font-size')
        measureWidthElm.innerText = input.value;
        const textWidth = measureWidthElm.offsetWidth
        const formWidth = document.querySelector('form[name=savethedate]').offsetWidth
        const parentElmWidth = input.parentElement.offsetWidth
        const maxWidth = parentElmWidth || formWidth
        input.style.width = (textWidth > originalElmWidth
            ? textWidth > maxWidth
                ? maxWidth
                : textWidth
            : originalElmWidth) + 'px'
    }

    resizeInput(input.value)

    input.addEventListener('input', resizeInput)
    window.addEventListener('resize', resizeInput)
}

makeInputResize(document.getElementById("email-going"))
makeInputResize(document.getElementById("first-name-going"))
makeInputResize(document.getElementById("last-name-going"))
makeInputResize(document.getElementById("first-name-not-going"))
makeInputResize(document.getElementById("last-name-not-going"))

// form handler
const loginForm = document.forms['savethedate']
const submitButton = document.forms['savethedate']['submit-button']

const handleError = e => {
    document.getElementById('error-msg').innerText = e.message
    console.error(e)
}

loginForm.addEventListener('submit', e => {
    e.preventDefault()
    submitButton.classList.add('submitting')
    const formData = new FormData(e.target)

    formData.append('token', localStorage.getItem('token'))
    localStorage.removeItem('token')

    fetch('https://script.google.com/macros/s/AKfycbzlDfJdr-lTdTmOuNGXMYS-53jjXf1QCW_dD_I6ZmLYRSO_Y7UCgzcGertCfHIT5nbx/exec', {
        method: 'POST',
        body: formData
    }).then(r => r.json())
        .then(r => {
            switch (r.status) {
                case 'success':
                    localStorage.setItem('token', r.token)
                    window.location = '/thankyou/'
                    break
                case 'unauthorized':
                    localStorage.clear()
                    localStorage.setItem('error-msg', r.message)
                    window.location = '/'
                    break
                default:
                    handleError(r)
            }
        })
        .catch(e => {
            handleError(e)
        })
        .finally(() => submitButton.classList.remove('submitting'))
})
