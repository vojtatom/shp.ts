import { CoordType, triangulate } from '@shpts/shpts';
import { Ring } from '@shpts/types/coordinate';
import { expect, test } from 'vitest';

test('triangulate 2D', async () => {
    const input: Ring[] = [
        [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
        ],
    ];
    const output = triangulate(input, CoordType.XY);
    expect(output).toEqual(new Float32Array([1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1]));

    const output2 = triangulate(input, CoordType.XY, true);
    expect(output2).toEqual(new Float32Array([1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1]));
});

test('triangulate 2D with hole', async () => {
    const input: Ring[] = [
        [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
        ],
        [
            [0.25, 0.25],
            [0.75, 0.25],
            [0.75, 0.75],
            [0.25, 0.75],
            [0.25, 0.25],
        ],
    ];

    const output = triangulate(input, CoordType.XY);
    expect(output).toEqual(
        new Float32Array([
            0, 0, 0.25, 0.25, 0.25, 0.75, 0.75, 0.25, 0.25, 0.25, 0, 0, 0, 1, 0, 0, 0.25, 0.75,
            0.75, 0.25, 0, 0, 1, 0, 1, 1, 0, 1, 0.25, 0.75, 0.75, 0.75, 0.75, 0.25, 1, 0, 1, 1,
            0.25, 0.75, 0.75, 0.75, 0.75, 0.75, 1, 0, 1, 1,
        ])
    );
});

test('triangulate 3D', async () => {
    const input: Ring[] = [
        [
            [0, 0, 0, NaN],
            [0, 1, 0, NaN],
            [0, 1, 1, NaN],
            [0, 0, 1, NaN],
            [0, 0, 0, NaN],
        ],
    ];
    const output = triangulate(input, CoordType.XYZM);
    expect(output).toEqual(
        new Float32Array([
            0,
            1,
            1,
            NaN,
            0,
            0,
            1,
            NaN,
            0,
            0,
            0,
            NaN,
            0,
            0,
            0,
            NaN,
            0,
            1,
            0,
            NaN,
            0,
            1,
            1,
            NaN,
        ])
    );
});

test('triangulate 3D, ignore M', async () => {
    const input: Ring[] = [
        [
            [0, 0, 0, NaN],
            [0, 1, 0, NaN],
            [0, 1, 1, NaN],
            [0, 0, 1, NaN],
            [0, 0, 0, NaN],
        ],
    ];
    const output = triangulate(input, CoordType.XYZM, true);
    expect(output).toEqual(
        new Float32Array([0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1])
    );
});

test('triangulate 3D with hole', async () => {
    const input: Ring[] = [
        [
            [0, 0, 0, NaN],
            [0, 1, 0, NaN],
            [0, 1, 1, NaN],
            [0, 0, 1, NaN],
            [0, 0, 0, NaN],
        ],
        [
            [0, 0.25, 0.25, NaN],
            [0, 0.75, 0.25, NaN],
            [0, 0.75, 0.75, NaN],
            [0, 0.25, 0.75, NaN],
            [0, 0.25, 0.25, NaN],
        ],
    ];

    const output = triangulate(input, CoordType.XYZM, true);
    expect(output).toEqual(
        new Float32Array([
            0, 1, 0, 0, 0.75, 0.25, 0, 0.25, 0.25, 0, 0.75, 0.75, 0, 0.75, 0.25, 0, 1, 0, 0, 0, 0,
            0, 1, 0, 0, 0.25, 0.25, 0, 0.75, 0.75, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0.25,
            0.25, 0, 0.25, 0.75, 0, 0.75, 0.75, 0, 1, 1, 0, 0, 1, 0, 0.25, 0.25, 0, 0.25, 0.75, 0,
            0.25, 0.75, 0, 1, 1, 0, 0, 1,
        ])
    );
});

test('degenerate cases', async () => {
    //overlaping points
    let input: Ring[] = [
        [
            [0, 0, 0, NaN],
            [0, 1, 0, NaN],
            [0, 1, 0, NaN],
            [0, 0, 0, NaN],
        ],
    ];

    let output = triangulate(input, CoordType.XYZM);
    expect(output).toEqual(new Float32Array([]));

    //multiple overlaping points
    input = [
        [
            [0, 0, 0, NaN],
            [0, 0, 0, NaN],
            [0, 0, 0, NaN],
            [0, 0, 0, NaN],
            [0, 0, 0, NaN],
        ],
    ];
    output = triangulate(input, CoordType.XYZM);
    expect(output).toEqual(new Float32Array([]));

    //empty input
    input = [[]];
    output = triangulate(input, CoordType.XYZM);
    expect(output).toEqual(new Float32Array([]));

    //single point
    input = [[[0, 0, 0, NaN]]];
    output = triangulate(input, CoordType.XYZM);
    expect(output).toEqual(new Float32Array([]));

    //colinear points
    input = [
        [
            [0, 0, 0, NaN],
            [0, 2, 0, NaN],
            [0, 1, 0, NaN],
            [0, 0, 0, NaN],
        ],
    ];
    output = triangulate(input, CoordType.XYZM);
    expect(output).toEqual(new Float32Array([]));
});
