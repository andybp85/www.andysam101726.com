import { test } from 'node:test'
import assert from 'node:assert/strict'
import { partiesByLastName, labelForParty } from '../rsvp/party.js'

// `guests` is the GUESTS response shape: an object keyed by group id, each value
// an array of members { first, last, slot }. `slot` members are open +1 seats and
// must never be matched on (they have no real surname).
const guests = {
    g1: [{ first: 'Andy', last: 'Harber', slot: false }, { first: 'Sam', last: 'Stanish', slot: false }],
    g2: [{ first: 'Pat', last: 'harber', slot: false }],
    g3: [{ first: 'Lee', last: 'Jones', slot: false }, { first: 'Guest', last: '', slot: true }],
    g4: [{ first: 'Imposter', last: 'Harber', slot: true }],   // slot only — must not match
}

test('partiesByLastName matches case-insensitively and trims the query', () => {
    assert.equal(partiesByLastName(guests, 'harber').length, 2)
    assert.equal(partiesByLastName(guests, '  HARBER  ').length, 2)
})

test('partiesByLastName returns one party per matching group, as { id, members }', () => {
    const parties = partiesByLastName(guests, 'Harber')
    assert.deepEqual(parties.map(p => p.id).sort(), ['g1', 'g2'])
    assert.equal(parties[0].members, guests[parties[0].id])   // members carried through by reference
})

test('partiesByLastName ignores slot (+1) members when matching', () => {
    // g4's only member is a slot with last "Harber" — it must be excluded.
    const ids = partiesByLastName(guests, 'Harber').map(p => p.id)
    assert.ok(!ids.includes('g4'))
})

test('partiesByLastName matches a non-first member of a group', () => {
    assert.deepEqual(partiesByLastName(guests, 'stanish').map(p => p.id), ['g1'])
})

test('partiesByLastName returns [] for no match, empty, or nullish input', () => {
    assert.deepEqual(partiesByLastName(guests, 'Nobody'), [])
    assert.deepEqual(partiesByLastName(guests, ''), [])
    assert.deepEqual(partiesByLastName(guests, null), [])
    assert.deepEqual(partiesByLastName(guests, undefined), [])
})

test('labelForParty joins real members by " & " and drops slots', () => {
    assert.equal(labelForParty(guests.g1), 'Andy & Sam')
    assert.equal(labelForParty(guests.g3), 'Lee')          // slot "Guest" excluded
    assert.equal(labelForParty(guests.g2), 'Pat')
})
