# RSVP prefill — show and edit an existing response

2026-07-02. Approved approach: extend the `GUESTS` reply with prior responses
(no new verb, no extra round-trip).

## Purpose

A guest who has already RSVP'd and returns to `/rsvp/` currently gets a blank
form and no sign we heard them. After this change, entering their last name
shows a banner acknowledging the earlier RSVP and the form arrives prefilled
with their last answers, ready to edit and resubmit until the deadline.

## API contract change

`VERB=GUESTS` reply gains one field:

```json
{
  "status": "success",
  "guests": { "<groupId>": [ { "first", "last", "slot" } ] },
  "responses": { "<groupId>": [ { "first", "last", "attending", "isGuest" } ] }
}
```

`responses` holds each party's **latest** submission only. The RSVP sheet is
append-only — `PUT` writes one row per member, all sharing one `Date.now()`
timestamp — so the latest submission for a group is exactly the rows carrying
that group's maximum timestamp, in written order. Groups that never RSVP'd are
absent from `responses`.

`PUT` is unchanged (append + notification email). The append-only history is
deliberate: any mistaken or mischievous overwrite stays recoverable in the
sheet (this is as far as we take audit finding #1; per-party token scoping is
out of scope).

Privacy tradeoff (accepted): any logged-in client receives all parties'
response statuses, same trust level as the guest list itself.

## Backend (Apps Script, via clasp in `new_design/apps-script/`)

`Code.js`:

- `latestResponses()` — reads the RSVP sheet
  (`rows: [ts, group, first, last, 'yes'|'no', 'guest'|'']`), reduces to
  `{group: rows-of-max-ts}`, mapping each row to
  `{first, last, attending: att === 'yes', isGuest: flag === 'guest'}`.
- `guests()` — adds `responses: latestResponses()` to its reply.

Rows whose group id matches no real party (e.g. old smoke-test rows) ride
along harmlessly; the frontend only looks up the matched party's id.

## Frontend (`rsvp/`)

**Cache** — `sessionStorage` key changes from `guests` to `guestData`, storing
the whole `{guests, responses}` pair. The old key is simply ignored. After a
successful `PUT`, the cached `responses[group.id]` is replaced in place with
the just-submitted responses (write-through), so a reload within the session
prefills the new answers.

**Party step** — when the matched party has prior responses:

- A banner (hidden `<p>` in `#step-party`, shown via JS) reads:
  > It looks like you've already RSVP'd! If anything's changed, update your
  > response below and resubmit by September 26th, 2026.
- The form prefills **positionally**: `PUT` writes rows in member order, so
  row *i* belongs to member *i*. This survives guest-list name corrections
  (e.g. Duarto→Duardo). Per member:
  - named member → attending / not-attending radio set from `attending`;
  - open +1 slot → attending: name input filled with `first + ' ' + last`
    (trimmed); declined: "not attending" checked, name left empty.
- If the prior row count ≠ current member count (guest list restructured since
  they RSVP'd), show the banner but skip the prefill — today's defaults are
  the safe fallback.
- No prior responses → exactly today's behavior, banner hidden.

**Pure helper** — `prefillPlan(members, prior)` in `rsvp/party.js`:
returns `undefined` on count mismatch or no prior; otherwise an array aligned
to members, `{attending}` for named members and `{declined, name}` for slots.
`rsvp/index.js` applies the plan during `renderParty`.

## Testing

- Unit (`tests/party.test.js`): `prefillPlan` — named yes/no, attending guest,
  declined guest, count mismatch → `undefined`, no prior → `undefined`.
- Browser (`tests/browser/rsvp.spec.js`, stubbed API):
  - party with prior responses → banner visible, radios/name prefilled;
  - party without → banner hidden, defaults;
  - resubmit → thanks step (existing test still green).

## Deployment

1. `clasp push` from `new_design/apps-script/` (project is container-bound to
   the RSVP sheet; gitignored — Google is its version control).
2. `clasp deploy -i AKfycbwfXZ…qdiqQ` — new version on the existing deployment,
   `/exec` URL unchanged.
3. Verify live with the two-step curl (login → GUESTS shows `responses`).
4. Frontend deploys later with the normal `deploy.sh` flow; until then the
   live site ignores the extra field (backward compatible both ways).
