import { Coord, PolygonCoord, Ring } from '@shpts/types/coordinate';

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

export function assemblePolygonsWithHoles(coords: Coord[][]) {
    const clockwiseRings: Coord[][] = [];
    const unusedHoldes: Coord[][] = [];

    for (const ring of coords) {
        if (isClockwise(ring)) clockwiseRings.push(ring);
        else unusedHoldes.push(ring);
    }

    const polygons: PolygonCoord = [];
    for (const clockwiseRing of clockwiseRings) {
        const polygon = [clockwiseRing];
        for (let i = unusedHoldes.length - 1; i >= 0; i--) {
            if (isRingInRing(clockwiseRing, unusedHoldes[i])) {
                polygon.push(unusedHoldes[i]);
                unusedHoldes.splice(i, 1);
            }
        }
        polygons.push(polygon);
    }

    if (unusedHoldes.length) {
        //console.warn('Some holes are not in any polygon, inserting as individual polygons.');
        polygons.push(...unusedHoldes.map((ring) => [ring]));
    }

    return polygons;
}
