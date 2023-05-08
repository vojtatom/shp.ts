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
        ],
    ];
    const output = triangulate(input, CoordType.XY);
    expect(output).toEqual(new Float32Array([1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1]));
});

test('triangulate 3D', async () => {
    const input: Ring[] = [
        [
            [0, 0, 0],
            [0, 1, 0],
            [0, 1, 1],
            [0, 0, 1],
        ],
    ];
    const output = triangulate(input, CoordType.XYZM);
    expect(output).toEqual(
        new Float32Array([0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1])
    );
});
