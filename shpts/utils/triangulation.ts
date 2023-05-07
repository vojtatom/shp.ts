import { CoordType, Ring } from '@shpts/types/coordinate';
import { earcut } from './mapbox/earcut';

function project(points: number[], type: CoordType) {
    //TODO implement
    return points.slice();
}

export function triangulate(rings: Ring[], type: CoordType) {
    const coordinates: number[] = [];
    const holeIndices: number[] = [];
    const dim = type === CoordType.XYZM ? 3 : 2;

    rings.forEach((ring, index) => {
        if (index > 0) holeIndices.push(coordinates.length / dim);
        ring.forEach((coord) => {
            coordinates.push(...coord.slice(0, dim));
        });
    });

    const projected = project(coordinates, type);
    const indices = earcut(projected, holeIndices, dim);
    //TODO to buffer and return
}
