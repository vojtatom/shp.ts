import { expect, test } from 'vitest';
import { Coord } from '@shpts/types/coordinate';
import { assemblePolygonsWithHoles } from '@shpts/utils/orientation';

test('Testing orientiton for vertical polygons', async () => {
    const verticalPolygon: Coord[][] = [
        [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 0, 1, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [2, 0, 1, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    ]; // vertical polygon

    const assembled = assemblePolygonsWithHoles(verticalPolygon);
    expect(assembled[0][0]).toEqual(verticalPolygon[0]);
    expect(assembled[1][0]).toEqual(verticalPolygon[1]);
});
