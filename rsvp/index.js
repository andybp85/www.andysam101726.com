import { partiesByLastName, labelForParty } from './party.js'

const API = 'https://script.google.com/macros/s/AKfycbwfXZMR_HIAoBzBZaS6bpmgB-pNZRkrjxRn6Bq09__brkhYBJNZUaGrMnPYkYDDoqdiqQ/exec'
const norm = s => (s || '').trim().toLowerCase()

let matchedGroup = null  // { id, members:[{first,last,slot}] }

async function getGuests() {
    const cached = sessionStorage.getItem('guests')
    if (cached) {
        try {
            return JSON.parse(cached)
        } catch (e) {
            sessionStorage.removeItem('guests')
        }
    }
    const body = new FormData()
    body.append('VERB', 'GUESTS')
    body.append('token', localStorage.getItem('token'))
    const r = await (await fetch(API, {method: 'POST', body})).json()
    if (r.status !== 'success') throw new Error('Could not load the guest list. Please try again.')
    sessionStorage.setItem('guests', JSON.stringify(r.guests))
    return r.guests
}

function renderParty(group) {
    const wrap = document.getElementById('members')
    wrap.innerHTML = group.members.map((m, i) => {
        const nameCell = m.slot
            ? `<input class="guest-name" data-i="${i}" placeholder="name" aria-label="Guest ${i + 1} name">
               <label class="guest-flag"><input type="checkbox" class="guest-check" data-i="${i}"> Guest</label>`
            : `<span class="member-name">${m.first} ${m.last}</span>`
        return `<fieldset class="member" data-i="${i}">
            ${nameCell}
            <label><input type="radio" name="att-${i}" value="yes" checked> Attending</label>
            <label><input type="radio" name="att-${i}" value="no"> Not attending</label>
        </fieldset>`
    }).join('')
}

document.getElementById('name-form').addEventListener('submit', async e => {
    e.preventDefault()
    const err = document.getElementById('name-error')
    err.textContent = ''
    try {
        const guests = await getGuests()
        const lastValue = e.target.last.value
        const parties = partiesByLastName(guests, lastValue)
        if (parties.length === 0) {
            err.textContent = "We couldn't find that name. Please check the spelling, or contact us."
            return
        }
        if (parties.length === 1) {
            matchedGroup = parties[0]
            renderParty(matchedGroup)
            document.getElementById('step-name').hidden = true
            document.getElementById('step-party').hidden = false
        } else {
            const list = document.getElementById('party-list')
            list.innerHTML = ''
            for (const p of parties) {
                const btn = document.createElement('button')
                btn.type = 'button'
                btn.className = 'party-pick'
                btn.textContent = labelForParty(p.members)
                btn.addEventListener('click', () => {
                    matchedGroup = p
                    renderParty(matchedGroup)
                    document.getElementById('step-pick').hidden = true
                    document.getElementById('step-party').hidden = false
                })
                list.appendChild(btn)
            }
            document.getElementById('step-name').hidden = true
            document.getElementById('step-pick').hidden = false
        }
    } catch (ex) {
        err.textContent = ex.message
    }
})

document.getElementById('party-form').addEventListener('submit', e => {
    e.preventDefault()
    const responses = matchedGroup.members.map((m, i) => {
        const fs = document.querySelector(`.member[data-i="${i}"]`)
        const attending = fs.querySelector(`input[name="att-${i}"]:checked`).value === 'yes'
        if (m.slot) {
            const name = fs.querySelector('.guest-name').value.trim()
            const isGuest = fs.querySelector('.guest-check').checked || name === ''
            const [first, ...rest] = name.split(' ')
            return {first: isGuest && !name ? 'Guest' : (first || 'Guest'), last: rest.join(' '), attending, isGuest}
        }
        return {first: m.first, last: m.last, attending, isGuest: false}
    })

    // optimistic: confirm immediately, write in background
    document.getElementById('step-party').hidden = true
    document.getElementById('step-thanks').hidden = false

    const body = new FormData()
    body.append('VERB', 'PUT')
    body.append('token', localStorage.getItem('token'))
    body.append('group', matchedGroup.id)
    body.append('responses', JSON.stringify(responses))
    fetch(API, {method: 'POST', body})
        .then(r => r.json())
        .then(r => { if (r.status !== 'success') throw new Error(r.message) })
        .catch(ex => {
            document.getElementById('step-thanks').hidden = true
            document.getElementById('step-party').hidden = false
            document.getElementById('submit-error').textContent =
                'Something went wrong saving your RSVP. Please try submitting again.'
            console.error(ex)
        })
})
