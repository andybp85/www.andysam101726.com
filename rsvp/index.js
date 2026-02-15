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
        const formWidth = document.querySelector('form[name=rsvp]').offsetWidth
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
