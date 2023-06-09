import { CoordType, Ring } from '@shpts/types/coordinate';
import { earcut } from './mapbox/earcut';
import { vec3, vec2 } from 'gl-matrix';

//find a normal Newell's method
function normal(points: number[], dim: number) {
    const normal: vec3 = [0, 0, 0];
    const n = points.length;
    let p1x, p1y, p1z, p2x, p2y, p2z, p1, p2;
    for (let i = 0; i < n; i += dim) {
        p1 = i;
        p2 = (i + dim) % n;
        p1x = points[p1];
        p1y = points[p1 + 1];
        p1z = points[p1 + 2];
        p2x = points[p2];
        p2y = points[p2 + 1];
        p2z = points[p2 + 2];
        normal[0] += (p1y - p2y) * (p1z + p2z);
        normal[1] += (p1z - p2z) * (p1x + p2x);
        normal[2] += (p1x - p2x) * (p1y + p2y);
    }

    vec3.normalize(normal, normal);
    return normal;
}

function centroid(points: number[], dim: number) {
    const n = points.length;
    let x = 0,
        y = 0,
        z = 0;

    for (let i = 0; i < n; i += dim) {
        x += points[i];
        y += points[i + 1];
        z += points[i + 2];
    }

    return [x / (n / dim), y / (n / dim), z / (n / dim)] as vec3;
}

function find2DBasis(normal: vec3) {
    let u: vec3;
    if (Math.abs(normal[0]) <= Math.abs(normal[1]) && Math.abs(normal[0]) <= Math.abs(normal[2])) {
        u = [0, -normal[2], normal[1]];
    } else if (
        Math.abs(normal[1]) <= Math.abs(normal[0]) &&
        Math.abs(normal[1]) <= Math.abs(normal[2])
    ) {
        u = [-normal[2], 0, normal[0]];
    } else {
        u = [-normal[1], normal[0], 0];
    }

    const v = [
        normal[1] * u[2] - normal[2] * u[1],
        normal[2] * u[0] - normal[0] * u[2],
        normal[0] * u[1] - normal[1] * u[0],
    ];

    return [u, v] as [vec3, vec3];
}

function projectTo2D(x: number, y: number, z: number, origin: vec3, basis: [vec3, vec3]) {
    const u = basis[0];
    const v = basis[1];
    const w: vec3 = [x - origin[0], y - origin[1], z - origin[2]];
    return [vec3.dot(u, w), vec3.dot(v, w)] as vec2;
}

function isDegenerate(normal: vec3) {
    return isNaN(vec3.length(normal)) || vec3.length(normal) < 1e-10;
}

function project(points: number[], type: CoordType) {
    const dim = type === CoordType.XYZM ? 4 : type === CoordType.XY ? 2 : 3;

    if (dim === 2) return points;

    const normalVector = normal(points, dim);
    if (isDegenerate(normalVector)) return [];

    const centroidVector = centroid(points, dim);
    const basis = find2DBasis(normalVector);

    const projected: number[] = [];
    for (let i = 0; i < points.length; i += dim) {
        const [x, y] = projectTo2D(points[i], points[i + 1], points[i + 2], centroidVector, basis);
        projected.push(x, y);
    }

    return projected;
}

// Triangulate a polygon
// Expects a polygon as an array of rings, where each ring is an array of points, where each point is an array of numbers
// Returns an array of vertices organized as triangles
// The first and last point of each ring has to be the same
export function triangulate(rings: Ring[], type: CoordType, ignoreM = false) {
    const coordinates: number[] = [];
    const holeIndices: number[] = [];
    const dim = type === CoordType.XYZM ? 4 : type === CoordType.XY ? 2 : 3;

    rings.forEach((ring, index) => {
        if (index > 0) holeIndices.push(coordinates.length / dim);
        ring.forEach((coord, index) => {
            if (index === ring.length - 1) return;
            coordinates.push(...coord.slice());
        });
    });

    const projected = project(coordinates, type);
    if (projected.length === 0) return new Float32Array([]); //handle degenerate case
    const indices = earcut(projected, holeIndices, 2);

    let dimLoc = dim;
    if (ignoreM) dimLoc = Math.min(dim, 3);

    const vertices = new Float32Array(indices.length * dimLoc);
    for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        for (let j = 0; j < dimLoc; j++) vertices[i * dimLoc + j] = coordinates[index * dim + j];
    }
    return vertices;
}
