// Tuning geometry. Station 0 (HOME) rests at 0° — the arrow points straight up —
// and the indicator sweeps clockwise in equal steps to the last station at SWEEP°.
const SWEEP = 270

export function angleFromStation(i, n) { return SWEEP * i / (n - 1) }

export function stationFromAngle(deg, n) {
    const clamped = Math.max(0, Math.min(SWEEP, deg))
    return Math.round(clamped / SWEEP * (n - 1))
}

// Pointer angle measured clockwise from straight up (0 = up, 90 = right), 0..360.
export function angleFromPointer(cx, cy, px, py) {
    const a = Math.atan2(px - cx, -(py - cy)) * 180 / Math.PI
    return (a + 360) % 360
}
