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
const nameLabel = text => `<span class="member-name">${text}</span>`
// Named member: pick attending / not attending.
const attendChoice = i => `<div class="attend">
            <label><input type="radio" name="att-${i}" value="yes" checked> attending</label>
            <label><input type="radio" name="att-${i}" value="no"> not attending</label>
        </div>`
// Open +1: a name (filling it in means attending) OR a "not attending" box — one is required.
const guestField = i => `<input class="guest-name" data-i="${i}" placeholder="name" aria-label="Guest ${i + 1} name">
        <div class="attend">
            <label><input type="checkbox" class="guest-decline" data-i="${i}"> not attending</label>
        </div>`

const memberRow = (m, i) => `<fieldset class="member" data-i="${i}">
        ${m.slot ? nameLabel('Guest') : nameLabel(`${m.first} ${m.last}`)}
        ${m.slot ? guestField(i) : attendChoice(i)}
    </fieldset>`

function renderParty(group) {
    $('members').innerHTML = group.members.map(memberRow).join('')
    // Guest slots: a name and "not attending" are alternatives — keep them in sync.
    for (const fs of $('members').querySelectorAll('.member')) {
        const name = fs.querySelector('.guest-name')
        if (!name) continue
        const decline = fs.querySelector('.guest-decline')
        name.addEventListener('input', () => name.value.trim() && (decline.checked = false))
        decline.addEventListener('change', () => decline.checked && (name.value = ''))
    }
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

$('party-form').addEventListener('submit', async e => {
    e.preventDefault()
    $('submit-error').textContent = ''
    const responses = []
    for (const [i, m] of matchedGroup.members.entries()) {
        const fs = document.querySelector(`.member[data-i="${i}"]`)
        if (!m.slot) {
            const attending = fs.querySelector(`input[name="att-${i}"]:checked`).value === 'yes'
            responses.push({first: m.first, last: m.last, attending, isGuest: false})
            continue
        }
        // Open +1: enter a name (they're attending) or check "not attending" — one is required.
        const name = fs.querySelector('.guest-name').value.trim()
        const declined = fs.querySelector('.guest-decline').checked
        if (!name && !declined) {
            $('submit-error').textContent = 'For each guest, enter a name or check "not attending".'
            fs.querySelector('.guest-name').focus()
            return
        }
        responses.push({...parseGuest(name), attending: name !== '' && !declined, isGuest: true})
    }

    // synchronous: write first, only confirm once the save succeeds
    const btn = e.target.querySelector('button[type="submit"]')
    btn.disabled = true
    try {
        await postForm({
            VERB: 'PUT',
            token: localStorage.getItem('token'),
            group: matchedGroup.id,
            responses: JSON.stringify(responses),
        }).then(ensureOk)
        $('step-party').hidden = true
        $('step-thanks').hidden = false
    } catch (ex) {
        $('submit-error').textContent =
            'Something went wrong saving your RSVP. Please try submitting again.'
        console.error(ex)
    } finally {
        btn.disabled = false
    }
})
