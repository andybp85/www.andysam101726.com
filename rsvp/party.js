export function partiesByLastName(guests, last) {
    const l = (last || '').trim().toLowerCase()
    return Object.entries(guests)
        .filter(([, members]) => members.some(m => !m.slot && (m.last || '').trim().toLowerCase() === l))
        .map(([id, members]) => ({ id, members }))
}

export function labelForParty(members) {
    return members.filter(m => !m.slot).map(m => m.first).join(' & ')
}
