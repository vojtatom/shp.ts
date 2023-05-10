import { expect, test } from 'vitest';
import { expectGeometry, expectPointsEqual, openFileAsArray } from './utils';
import { ShapeReader, PointRecord, CoordType } from '@shpts/shpts';

test('Reading PointRecord', async () => {
    const shpBuffer = openFileAsArray('testdata/point.shp');
    const shxBuffer = openFileAsArray('testdata/point.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XY, PointRecord);
    expect(geom.type).toEqual('Point');
    expectPointsEqual(geom.coords, [-155, -154]);
    geom = expectGeometry(reader, 4, CoordType.XY, PointRecord);
    expectPointsEqual(geom.coords, [-147.43741476950902, -157.28937716011498]);
});

test('Reading PointRecord with M ', async () => {
    const shpBuffer = openFileAsArray('testdata/pointM.shp');
    const shxBuffer = openFileAsArray('testdata/pointM.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XYM, PointRecord);
    expect(geom.type).toEqual('Point');
    expectPointsEqual((geom as PointRecord).coords, [-178, -160, 1]);
    geom = expectGeometry(reader, 1, CoordType.XYM, PointRecord);
    expect(geom.type).toEqual('Point');
    expectPointsEqual((geom as PointRecord).coords, [-177, -165, 1000]);
    geom = expectGeometry(reader, 2, CoordType.XYM, PointRecord);
    expect(geom.type).toEqual('Point');
    expectPointsEqual((geom as PointRecord).coords, [-171, -165, NaN]);
});

test('Reading PointRecord with Z', async () => {
    const shpBuffer = openFileAsArray('testdata/pointZM.shp');
    const shxBuffer = openFileAsArray('testdata/pointZM.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XYZM, PointRecord);
    expect(geom.type).toEqual('Point');
    expectPointsEqual((geom as PointRecord).coords, [-153, -178, 1, 2]);
    geom = expectGeometry(reader, 1, CoordType.XYZM, PointRecord);
    expect(geom.type).toEqual('Point');
    expectPointsEqual((geom as PointRecord).coords, [-158, -175, 2, 3]);
    geom = expectGeometry(reader, 5, CoordType.XYZM, PointRecord);
    expect(geom.type).toEqual('Point');
    expectPointsEqual((geom as PointRecord).coords, [-159, -186, 99.999, NaN]);
});
