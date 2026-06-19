const SWEEP = 270, HALF = SWEEP / 2

export function angleFromStation(i, n) { return -HALF + (SWEEP * i) / (n - 1) }
export function stationFromAngle(deg, n) {
    const clamped = Math.max(-HALF, Math.min(HALF, deg))
    return Math.round(((clamped + HALF) / SWEEP) * (n - 1))
}
export function angleFromPointer(cx, cy, px, py) {
    return Math.atan2(py - cy, px - cx) * 180 / Math.PI
}
