import { test } from 'node:test'
import assert from 'node:assert/strict'
import { API, postForm, ensureOk } from '../api.js'

test('ensureOk passes a successful response straight through', () => {
    const r = { status: 'success', token: 'abc' }
    assert.equal(ensureOk(r), r)
})

test('ensureOk throws the response message on non-success', () => {
    assert.throws(() => ensureOk({ message: 'bad name', status: 'error' }), /bad name/)
})

// postForm builds a FormData and POSTs it to the single API endpoint. Stub the
// global fetch so nothing leaves the machine; assert what it was called with.
test('postForm appends a plain object as FormData and POSTs to the API', async () => {
    const calls = []
    const realFetch = globalThis.fetch
    globalThis.fetch = async (url, opts) => {
        calls.push({ opts, url })
        return { json: async () => ({ echoed: true, status: 'success' }) }
    }
    try {
        const out = await postForm({ password: 'Surname', VERB: 'POST' })
        assert.deepEqual(out, { echoed: true, status: 'success' })

        assert.equal(calls.length, 1)
        assert.equal(calls[0].url, API)
        assert.equal(calls[0].opts.method, 'POST')
        const body = calls[0].opts.body
        assert.ok(body instanceof FormData)
        assert.equal(body.get('VERB'), 'POST')
        assert.equal(body.get('password'), 'Surname')
    } finally {
        globalThis.fetch = realFetch
    }
})

test('postForm uses a ready FormData as-is (e.g. a whole <form>)', async () => {
    const fd = new FormData()
    fd.append('VERB', 'PUT')
    let seenBody
    const realFetch = globalThis.fetch
    globalThis.fetch = async (_url, opts) => {
        seenBody = opts.body
        return { json: async () => ({ status: 'success' }) }
    }
    try {
        await postForm(fd)
        assert.equal(seenBody, fd)   // same instance, not re-wrapped
    } finally {
        globalThis.fetch = realFetch
    }
})
