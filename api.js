// Single source of truth for the Google Apps Script backend. The action is
// passed as a hidden VERB field (POST login, GUESTS guest-list, PUT rsvp);
// see CLAUDE.md. The Apps Script is not in this repo.
export const API = 'https://script.google.com/macros/s/AKfycbwfXZMR_HIAoBzBZaS6bpmgB-pNZRkrjxRn6Bq09__brkhYBJNZUaGrMnPYkYDDoqdiqQ/exec'

// POST to the backend and resolve the parsed JSON response. `fields` is either
// a ready FormData (used as-is, e.g. a whole <form>) or a plain object whose
// entries are appended to a fresh FormData.
export async function postForm(fields) {
    const body = fields instanceof FormData
        ? fields
        : Object.entries(fields).reduce((fd, [k, v]) => (fd.append(k, v), fd), new FormData())
    const res = await fetch(API, {method: 'POST', body})
    return res.json()
}
