import { ShapeReader } from '@shpts/reader/reader';
import { Coord, CoordType } from '@shpts/types/coordinate';
import fs from 'fs';
import { expect } from 'vitest';

function toArrayBuffer(buffer: Buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
}

export function openFileAsArray(file: string) {
    const buffer = Buffer.from(fs.readFileSync(file, { encoding: 'binary' }), 'binary');
    return toArrayBuffer(buffer);
}

// According to Shape spec, M values less than this is NaN
export const mNaN = -Math.pow(-10, 38);

function expectEqualValue(actual: any, expected: any) {
    if (isNaN(expected)) {
        expect(actual).toBeLessThanOrEqual(mNaN);
    } else {
        expect(actual).toBeCloseTo(expected);
    }
}

export function expectPointsEqual(actual: Coord, expected: Coord) {
    expect(actual.length).toBe(expected.length);
    expectEqualValue(actual[0], expected[0]);
    expectEqualValue(actual[1], expected[1]);
    if (actual.length > 2) expectEqualValue(actual[2], expected[2]);
    if (actual.length > 3) expectEqualValue(actual[3], expected[3]);
}

type Constructor<T> = new (...args: any[]) => T;

export function expectGeometry<TRecord>(
    reader: ShapeReader,
    index: number,
    coordType: CoordType,
    type: Constructor<TRecord>
): TRecord {
    let geom = reader.readGeom(index);
    expect(geom).toBeDefined();
    expect(geom.coordType).toBe(coordType);
    expect(geom instanceof type).toBe(true);
    return geom as TRecord;
}
