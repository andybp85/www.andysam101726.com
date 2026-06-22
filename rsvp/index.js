import { partiesByLastName, labelForParty } from './party.js'
import { postForm, ensureOk } from '/api.js'

const $ = id => document.getElementById(id)

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
    const r = await postForm({VERB: 'GUESTS', token: localStorage.getItem('token')})
    if (r.status !== 'success') throw new Error('Could not load the guest list. Please try again.')
    sessionStorage.setItem('guests', JSON.stringify(r.guests))
    return r.guests
}

// ── Pure view helpers: member data → markup string ──
const guestCell = i =>
    `<input class="guest-name" data-i="${i}" placeholder="name" aria-label="Guest ${i + 1} name">
        <label class="guest-flag"><input type="checkbox" class="guest-check" data-i="${i}"> Guest</label>`

const nameCell = m => `<span class="member-name">${m.first} ${m.last}</span>`

const memberRow = (m, i) => `<fieldset class="member" data-i="${i}">
        ${m.slot ? guestCell(i) : nameCell(m)}
        <label><input type="radio" name="att-${i}" value="yes" checked> attending</label>
        <label><input type="radio" name="att-${i}" value="no"> not attending</label>
    </fieldset>`

function renderParty(group) {
    $('members').innerHTML = group.members.map(memberRow).join('')
}

// Guest's typed name → {first, last}; blank becomes "Guest".
const parseGuest = name => {
    const [first, ...rest] = name.split(' ')
    return {first: first || 'Guest', last: rest.join(' ')}
}

$('name-form').addEventListener('submit', async e => {
    e.preventDefault()
    const err = $('name-error')
    err.textContent = ''
    try {
        const guests = await getGuests()
        const parties = partiesByLastName(guests, e.target.last.value)
        if (parties.length === 0) {
            err.textContent = "We couldn't find that name. Please check the spelling, or contact us."
            return
        }
        if (parties.length === 1) {
            matchedGroup = parties[0]
            renderParty(matchedGroup)
            $('step-name').hidden = true
            $('step-party').hidden = false
        } else {
            const list = $('party-list')
            list.innerHTML = ''
            for (const p of parties) {
                const btn = document.createElement('button')
                btn.type = 'button'
                btn.className = 'party-pick'
                btn.textContent = labelForParty(p.members)
                btn.addEventListener('click', () => {
                    matchedGroup = p
                    renderParty(matchedGroup)
                    $('step-pick').hidden = true
                    $('step-party').hidden = false
                })
                list.appendChild(btn)
            }
            $('step-name').hidden = true
            $('step-pick').hidden = false
        }
    } catch (ex) {
        err.textContent = ex.message
    }
})

$('party-form').addEventListener('submit', e => {
    e.preventDefault()
    const responses = matchedGroup.members.map((m, i) => {
        const fs = document.querySelector(`.member[data-i="${i}"]`)
        const attending = fs.querySelector(`input[name="att-${i}"]:checked`).value === 'yes'
        if (!m.slot) return {first: m.first, last: m.last, attending, isGuest: false}
        const name = fs.querySelector('.guest-name').value.trim()
        const isGuest = fs.querySelector('.guest-check').checked || name === ''
        return {...parseGuest(name), attending, isGuest}
    })

    // optimistic: confirm immediately, write in background
    $('step-party').hidden = true
    $('step-thanks').hidden = false

    postForm({
        VERB: 'PUT',
        token: localStorage.getItem('token'),
        group: matchedGroup.id,
        responses: JSON.stringify(responses),
    })
        .then(ensureOk)
        .catch(ex => {
            $('step-thanks').hidden = true
            $('step-party').hidden = false
            $('submit-error').textContent =
                'Something went wrong saving your RSVP. Please try submitting again.'
            console.error(ex)
        })
})
