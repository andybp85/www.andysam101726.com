import { test } from 'node:test'
import assert from 'node:assert/strict'
import { angleFromStation, stationFromAngle, angleFromPointer } from '../radio-math.js'

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~= ${b}`)

// SWEEP is 270°: station 0 rests at 0° (arrow up), the last station at 270°.
test('angleFromStation spreads stations evenly across the 270° sweep', () => {
    assert.equal(angleFromStation(0, 5), 0)
    assert.equal(angleFromStation(4, 5), 270)     // last station
    assert.equal(angleFromStation(2, 5), 135)     // midpoint
    assert.equal(angleFromStation(1, 3), 135)
})

test('stationFromAngle rounds to the nearest station and clamps to range', () => {
    assert.equal(stationFromAngle(0, 5), 0)
    assert.equal(stationFromAngle(270, 5), 4)
    assert.equal(stationFromAngle(135, 5), 2)
    assert.equal(stationFromAngle(100, 5), 1)     // round(100/270*4) = round(1.48)
    assert.equal(stationFromAngle(-50, 5), 0)     // clamped below
    assert.equal(stationFromAngle(999, 5), 4)     // clamped above
})

test('angle/station are inverse for every station index', () => {
    for (const n of [2, 3, 5, 6]) {
        for (let i = 0; i < n; i++) {
            assert.equal(stationFromAngle(angleFromStation(i, n), n), i)
        }
    }
})

test('angleFromPointer measures clockwise from straight up (0..360)', () => {
    near(angleFromPointer(0, 0, 0, -10), 0)       // up
    near(angleFromPointer(0, 0, 10, 0), 90)       // right
    near(angleFromPointer(0, 0, 0, 10), 180)      // down
    near(angleFromPointer(0, 0, -10, 0), 270)     // left (wrapped into 0..360)
})
