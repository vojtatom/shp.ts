import { expect, test } from 'vitest';
import { expectGeometry, expectRing, openFileAsArray } from './utils';
import { ShapeReader, MultiPatchRecord, CoordType } from '@shpts/shpts';

test('Reading MultiPatchRecord with Z', async () => {
    const shpBuffer = openFileAsArray('testdata/multipatch.shp');
    const shxBuffer = openFileAsArray('testdata/multipatch.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    expect(reader.recordCount).toEqual(1);
    let geom = expectGeometry(reader, 0, CoordType.XYZM, MultiPatchRecord);
    expect(geom.type).toEqual('MultiPolygon');
    expect(geom.coords.length).toEqual(12);
    let polygon = geom.coords[0];
    expectRing(polygon[0], [
        { x: 0, y: 0, z: 0, m: NaN },
        { x: 0, y: 0, z: 3, m: NaN },
        { x: 5, y: 0, z: 0, m: NaN },
        { x: 0, y: 0, z: 0, m: NaN },
    ]);

    polygon = geom.coords[1];
    expectRing(polygon[0], [
        { x: 0, y: 0, z: 3, m: NaN },
        { x: 5, y: 0, z: 3, m: NaN },
        { x: 5, y: 0, z: 0, m: NaN },
        { x: 0, y: 0, z: 3, m: NaN },
    ]);

    polygon = geom.coords[2];
    expectRing(polygon[0], [
        { x: 5, y: 0, z: 0, m: NaN },
        { x: 5, y: 0, z: 3, m: NaN },
        { x: 5, y: 5, z: 0, m: NaN },
        { x: 5, y: 0, z: 0, m: NaN },
    ]);

    polygon = geom.coords[3];
    expectRing(polygon[0], [
        { x: 5, y: 0, z: 3, m: NaN },
        { x: 5, y: 5, z: 3, m: NaN },
        { x: 5, y: 5, z: 0, m: NaN },
        { x: 5, y: 0, z: 3, m: NaN },
    ]);

    polygon = geom.coords[4];
    expectRing(polygon[0], [
        { x: 5, y: 5, z: 0, m: NaN },
        { x: 5, y: 5, z: 3, m: NaN },
        { x: 0, y: 5, z: 0, m: NaN },
        { x: 5, y: 5, z: 0, m: NaN },
    ]);

    polygon = geom.coords[5];
    expectRing(polygon[0], [
        { x: 5, y: 5, z: 3, m: NaN },
        { x: 0, y: 5, z: 3, m: NaN },
        { x: 0, y: 5, z: 0, m: NaN },
        { x: 5, y: 5, z: 3, m: NaN },
    ]);

    polygon = geom.coords[6];
    expectRing(polygon[0], [
        { x: 0, y: 5, z: 0, m: NaN },
        { x: 0, y: 5, z: 3, m: NaN },
        { x: 0, y: 0, z: 0, m: NaN },
        { x: 0, y: 5, z: 0, m: NaN },
    ]);

    polygon = geom.coords[7];
    expectRing(polygon[0], [
        { x: 0, y: 5, z: 3, m: NaN },
        { x: 0, y: 0, z: 3, m: NaN },
        { x: 0, y: 0, z: 0, m: NaN },
        { x: 0, y: 5, z: 3, m: NaN },
    ]);

    polygon = geom.coords[8];
    expectRing(polygon[0], [
        { x: 2.5, y: 2.5, z: 5, m: NaN },
        { x: 0, y: 0, z: 3, m: NaN },
        { x: 5, y: 0, z: 3, m: NaN },
        { x: 2.5, y: 2.5, z: 5, m: NaN },
    ]);

    polygon = geom.coords[9];
    expectRing(polygon[0], [
        { x: 2.5, y: 2.5, z: 5, m: NaN },
        { x: 5, y: 0, z: 3, m: NaN },
        { x: 5, y: 5, z: 3, m: NaN },
        { x: 2.5, y: 2.5, z: 5, m: NaN },
    ]);

    polygon = geom.coords[10];
    expectRing(polygon[0], [
        { x: 2.5, y: 2.5, z: 5, m: NaN },
        { x: 5, y: 5, z: 3, m: NaN },
        { x: 0, y: 5, z: 3, m: NaN },
        { x: 2.5, y: 2.5, z: 5, m: NaN },
    ]);

    polygon = geom.coords[11];
    expectRing(polygon[0], [
        { x: 2.5, y: 2.5, z: 5, m: NaN },
        { x: 0, y: 5, z: 3, m: NaN },
        { x: 0, y: 0, z: 3, m: NaN },
        { x: 2.5, y: 2.5, z: 5, m: NaN },
    ]);
});

test('Reading MultiPatchRecord with Outer/Inner Rings', async () => {
    const shpBuffer = openFileAsArray('testdata/multipatchOuterInnerRings.shp');
    const shxBuffer = openFileAsArray('testdata/multipatchOuterInnerRings.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);
    expect(reader.recordCount).toEqual(1);

    let geom = expectGeometry(reader, 0, CoordType.XYZM, MultiPatchRecord);
    expect(geom.type).toEqual('Polygon');
    expect(geom.coords.length).toBe(1);
    let polygon = geom.coords[0];
    expect(polygon.length).toBe(3);
    expectRing(polygon[0], [
        { x: -149.92383493947585, y: -107.20901451037372, z: 0, m: NaN },
        { x: -140.61850329563254, y: -125.81967779806041, z: 0, m: NaN },
        { x: -203.09715861858095, y: -141.77167490179193, z: 0, m: NaN },
        { x: -258.2644819356524, y: -134.460342895915, z: 0, m: NaN },
        { x: -259.59381502763006, y: -109.20301414834012, z: 0, m: NaN },
        { x: -149.92383493947585, y: -107.20901451037372, z: 0, m: NaN },
    ]);
    expectRing(polygon[2], [
        { x: -211.55262105541485, y: -114.18079693534207, z: 0, m: NaN },
        { x: -222.17569209356486, y: -126.02960693943254, z: 0, m: NaN },
        { x: -198.47807208538396, y: -125.41673745646227, z: 0, m: NaN },
        { x: -211.55262105541485, y: -114.18079693534207, z: 0, m: NaN },
    ]);
    expectRing(polygon[1], [
        { x: -254.4534848633285, y: -128.68537469897, z: 0, m: NaN },
        { x: -239.54032744438703, y: -128.88966452662675, z: 0, m: NaN },
        { x: -241.1746460656409, y: -113.77221728002854, z: 0, m: NaN },
        { x: -252.63985750747375, y: -113.16878509887954, z: 0, m: NaN },
        { x: -254.4534848633285, y: -128.68537469897, z: 0, m: NaN },
    ]);
});

test('Reading MultiPatchRecord with First Ring and Rings', async () => {
    const shpBuffer = openFileAsArray('testdata/multipatchFirstRings.shp');
    const shxBuffer = openFileAsArray('testdata/multipatchFirstRings.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);
    expect(reader.recordCount).toEqual(1);

    let geom = expectGeometry(reader, 0, CoordType.XYZM, MultiPatchRecord);
    expect(geom.type).toEqual('Polygon');
    expect(geom.coords.length).toBe(1);
    let polygon = geom.coords[0];
    expect(polygon.length).toBe(3);
    expectRing(polygon[0], [
        { x: -149.92383493947585, y: -107.20901451037372, z: 0, m: NaN },
        { x: -140.61850329563254, y: -125.81967779806041, z: 0, m: NaN },
        { x: -203.09715861858095, y: -141.77167490179193, z: 0, m: NaN },
        { x: -258.2644819356524, y: -134.460342895915, z: 0, m: NaN },
        { x: -259.59381502763006, y: -109.20301414834012, z: 0, m: NaN },
        { x: -149.92383493947585, y: -107.20901451037372, z: 0, m: NaN },
    ]);
    expectRing(polygon[2], [
        { x: -211.55262105541485, y: -114.18079693534207, z: 0, m: NaN },
        { x: -222.17569209356486, y: -126.02960693943254, z: 0, m: NaN },
        { x: -198.47807208538396, y: -125.41673745646227, z: 0, m: NaN },
        { x: -211.55262105541485, y: -114.18079693534207, z: 0, m: NaN },
    ]);
    expectRing(polygon[1], [
        { x: -254.4534848633285, y: -128.68537469897, z: 0, m: NaN },
        { x: -239.54032744438703, y: -128.88966452662675, z: 0, m: NaN },
        { x: -241.1746460656409, y: -113.77221728002854, z: 0, m: NaN },
        { x: -252.63985750747375, y: -113.16878509887954, z: 0, m: NaN },
        { x: -254.4534848633285, y: -128.68537469897, z: 0, m: NaN },
    ]);
});

test('Reading MultiPatchRecord with First Ring and Rings', async () => {
    const shpBuffer = openFileAsArray('testdata/multipatchRings.shp');
    const shxBuffer = openFileAsArray('testdata/multipatchRings.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);
    expect(reader.recordCount).toEqual(1);

    let geom = expectGeometry(reader, 0, CoordType.XYZM, MultiPatchRecord);
    expect(geom.type).toEqual('MultiPolygon');
    expect(geom.coords.length).toBe(3);
    let polygon = geom.coords[0];
    expect(polygon.length).toBe(1);
    expectRing(polygon[0], [
        { x: -149.92383493947585, y: -107.20901451037372, z: 0, m: NaN },
        { x: -140.61850329563254, y: -125.81967779806041, z: 0, m: NaN },
        { x: -203.09715861858095, y: -141.77167490179193, z: 0, m: NaN },
        { x: -258.2644819356524, y: -134.460342895915, z: 0, m: NaN },
        { x: -259.59381502763006, y: -109.20301414834012, z: 0, m: NaN },
        { x: -149.92383493947585, y: -107.20901451037372, z: 0, m: NaN },
    ]);
    polygon = geom.coords[1];
    expect(polygon.length).toBe(1);
    expectRing(polygon[0], [
        { x: -211.55262105541485, y: -114.18079693534207, z: 0, m: NaN },
        { x: -222.17569209356486, y: -126.02960693943254, z: 0, m: NaN },
        { x: -198.47807208538396, y: -125.41673745646227, z: 0, m: NaN },
        { x: -211.55262105541485, y: -114.18079693534207, z: 0, m: NaN },
    ]);
    polygon = geom.coords[2];
    expect(polygon.length).toBe(1);
    expectRing(polygon[0], [
        { x: -254.4534848633285, y: -128.68537469897, z: 0, m: NaN },
        { x: -239.54032744438703, y: -128.88966452662675, z: 0, m: NaN },
        { x: -241.1746460656409, y: -113.77221728002854, z: 0, m: NaN },
        { x: -252.63985750747375, y: -113.16878509887954, z: 0, m: NaN },
        { x: -254.4534848633285, y: -128.68537469897, z: 0, m: NaN },
    ]);
});
