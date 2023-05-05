import { expect, test } from 'vitest';
import { expectGeometry, expectPointsEqual, openFileAsArray } from './utils';
import { ShapeReader, MultiPointRecord, CoordType } from '@shpts/shpts';

test('Reading PointRecord', async () => {
    const shpBuffer = openFileAsArray('testdata/multipoint.shp');
    const shxBuffer = openFileAsArray('testdata/multipoint.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XY, MultiPointRecord);
    expect(geom.coords.length).toBe(5);
    expectPointsEqual(geom.coords[0], [36.963112042621276, -129.36489649456098]);
    expectPointsEqual(geom.coords[1], [37.148521428162326, -118.98197090426271]);
    expectPointsEqual(geom.coords[2], [41.227527910065135, -126.3983463259043]);
    expectPointsEqual(geom.coords[3], [47.71685640400153, -130.10653403672512]);
    expectPointsEqual(geom.coords[4], [48.273084560624625, -124.35884308495292]);

    geom = expectGeometry(reader, 1, CoordType.XY, MultiPointRecord);
    expect(geom.coords.length).toBe(4);
    expectPointsEqual(geom.coords[0], [56.060278753348484, -131.96062789213556]);
    expectPointsEqual(geom.coords[1], [57.72896322321782, -136.41045314512053]);
    expectPointsEqual(geom.coords[2], [61.0663321629566, -136.03963437403843]);
    expectPointsEqual(geom.coords[3], [63.662063560531124, -131.21899034997142]);

    geom = expectGeometry(reader, 2, CoordType.XY, MultiPointRecord);
    expect(geom.coords.length).toBe(3);
    expectPointsEqual(geom.coords[0], [44.564896849803915, -151.05779460286274]);
    expectPointsEqual(geom.coords[1], [47.71685640400153, -142.3435534824339]);
    expectPointsEqual(geom.coords[2], [53.093728584691746, -140.86027839810544]);
});

test('Reading PointRecord with M', async () => {
    const shpBuffer = openFileAsArray('testdata/multipointM.shp');
    const shxBuffer = openFileAsArray('testdata/multipointM.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XYM, MultiPointRecord);
    expect(geom.coords.length).toBe(5);
    expectPointsEqual(geom.coords[0], [88.87773999411263, -137.89372822944887, 1]);
    expectPointsEqual(geom.coords[1], [92.95674647601561, -143.08519102459798, 2]);
    expectPointsEqual(geom.coords[2], [92.95674647601561, -134.185540518628, 3]);
    expectPointsEqual(geom.coords[3], [96.29411541575422, -133.6293123620049, 4]);
    expectPointsEqual(geom.coords[4], [97.59198111454151, -141.41650655472864, 5]);

    geom = expectGeometry(reader, 1, CoordType.XYM, MultiPointRecord);
    expect(geom.coords.length).toBe(3);
    expectPointsEqual(geom.coords[0], [96.10870603021323, -121.94852107291939, 44]);
    expectPointsEqual(geom.coords[1], [98.33361865670565, -127.32539325360949, 55]);
    expectPointsEqual(geom.coords[2], [101.11475943982134, -122.69015861508353, 66]);

    geom = expectGeometry(reader, 2, CoordType.XYM, MultiPointRecord);
    expect(geom.coords.length).toBe(4);
    expectPointsEqual(geom.coords[0], [104.45212837956001, -133.2584935909228, 5]);
    expectPointsEqual(geom.coords[1], [106.86245039159343, -136.96668130174362, 55]);
    expectPointsEqual(geom.coords[2], [108.34572547592188, -128.06703079577363, 555]);
    expectPointsEqual(geom.coords[3], [112.79555072890696, -134.00013113308705, 5555]);
});

test('Reading PointRecord with Z', async () => {
    const shpBuffer = openFileAsArray('testdata/multipointZM.shp');
    const shxBuffer = openFileAsArray('testdata/multipointZM.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XYZM, MultiPointRecord);
    expect(geom.coords.length).toBe(6);
    expectPointsEqual(geom.coords[0], [106.12081284942929, -160.14285449437375, 0, NaN]);
    expectPointsEqual(geom.coords[1], [106.86245039159343, -155.32221047030666, 0, NaN]);
    expectPointsEqual(geom.coords[2], [109.08736301808602, -159.2158075666685, 0, NaN]);
    expectPointsEqual(geom.coords[3], [110.01440994579121, -162.92399527748938, 0, NaN]);
    expectPointsEqual(geom.coords[4], [112.98096011444795, -153.65352600043735, 0, NaN]);
    expectPointsEqual(geom.coords[5], [114.09341642769414, -160.3282638799148, 0, NaN]);

    geom = expectGeometry(reader, 1, CoordType.XYZM, MultiPointRecord);
    expect(geom.coords.length).toBe(1);
    expectPointsEqual(geom.coords[0], [110.01440994579121, -149.57451951853437, -10, -10]);

    geom = expectGeometry(reader, 2, CoordType.XYZM, MultiPointRecord);
    expect(geom.coords.length).toBe(3);
    expectPointsEqual(geom.coords[0], [89.06314937965368, -154.02434477151942, 22, -10]);
    expectPointsEqual(geom.coords[1], [91.8442901627692, -161.81153896424308, 33, -20]);
    expectPointsEqual(geom.coords[2], [96.10870603021323, -155.5076198558477, 44, -30]);
});
