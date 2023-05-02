import { Coord, Ring } from '@shpts/types/coordinate';

export function isClockwise(ring: Ring) {
    if (ring.length < 3) return false; //is hole if degenerate ring
    let area = ring[ring.length - 1][1] * ring[0][0] - ring[ring.length - 1][0] * ring[0][1];
    for (let i = 0; i < ring.length - 1; ++i) {
        area += ring[i][1] * ring[i + 1][0] - ring[i][0] * ring[i + 1][1];
    }
    return area > 0;
}

export function containsPoint(ring: Ring, point: Coord) {
    let inside = false;
    let xi, yi, xj, yj, intersect;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        xi = ring[i][0];
        yi = ring[i][1];
        xj = ring[j][0];
        yj = ring[j][1];
        intersect =
            yi > point[1] !== yj > point[1] &&
            point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

export function isRingInRing(ringOutside: Ring, ringInside: Ring) {
    for (let i = 0; i < ringInside.length; ++i) {
        if (!containsPoint(ringOutside, ringInside[i])) return false;
    }
    return true;
}
