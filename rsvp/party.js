export function partiesByLastName(guests, last) {
    const l = (last || '').trim().toLowerCase()
    return Object.entries(guests)
        .filter(([, members]) => members.some(m => !m.slot && (m.last || '').trim().toLowerCase() === l))
        .map(([id, members]) => ({ id, members }))
}

export function labelForParty(members) {
    return members.filter(m => !m.slot).map(m => m.first).join(' & ')
}

// Prefill plan for a party's form from its latest saved responses: one entry
// per member — {attending} for named members, {declined, name} for open +1
// slots. PUT writes rows in member order, so the mapping is positional (which
// survives guest-list name corrections). Returns undefined when there is
// nothing to prefill or the party changed shape since the RSVP (count
// mismatch) — the caller falls back to the default form.
export function prefillPlan(members, prior) {
    if (!prior || prior.length !== members.length) return undefined
    return members.map((m, i) => m.slot
        ? {
            declined: !prior[i].attending,
            name: prior[i].attending ? `${prior[i].first} ${prior[i].last}`.trim() : '',
        }
        : { attending: prior[i].attending })
}
