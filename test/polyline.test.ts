import { expect, test } from 'vitest';
import { expectGeometry, expectPointsEqual, openFileAsArray } from './utils';
import { ShapeReader, PolyLineRecord, CoordType } from '@shpts/shpts';

test('Reading PolyLineRecord', async () => {
    const shpBuffer = openFileAsArray('testdata/polyline.shp');
    const shxBuffer = openFileAsArray('testdata/polyline.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XY, PolyLineRecord);
    expect(geom.type).toEqual('LineString');
    expect(geom.coords.length).toBe(1);
    let segment = geom.coords[0];
    expect(segment.length).toBe(3);
    expectPointsEqual(segment[0], [-174.45654274957514, -156.65454128286527]);
    expectPointsEqual(segment[1], [-156.03631387961016, -160.44694134432868]);
    expectPointsEqual(segment[2], [-146.82619944462766, -153.40391265875377]);

    geom = expectGeometry(reader, 1, CoordType.XY, PolyLineRecord);
    expect(geom.type).toEqual('LineString');
    expect(geom.coords.length).toBe(1);

    geom = expectGeometry(reader, 2, CoordType.XY, PolyLineRecord);
    expect(geom.type).toEqual('MultiLineString');
    expect(geom.coords.length).toBe(3);
    segment = geom.coords[0];
    expect(segment.length).toBe(4);
    expectPointsEqual(segment[0], [-198.83625743041105, -175.07477015283018]);
    expectPointsEqual(segment[1], [-173.37299987487125, -185.36842746251656]);
    expectPointsEqual(segment[2], [-156.03631387961016, -185.91019889986848]);
    expectPointsEqual(segment[3], [-122.98825620114354, -172.90768440342256]);
    segment = geom.coords[1];
    expect(segment.length).toBe(4);
    expectPointsEqual(segment[0], [-201.54511461717064, -185.91019889986848]);
    expectPointsEqual(segment[1], [-175.54008562427896, -199.45448483366619]);
    expectPointsEqual(segment[2], [-153.86922813020246, -199.99625627101807]);
    expectPointsEqual(segment[3], [-132.74014207347795, -192.41145614809136]);
    segment = geom.coords[2];
    expect(segment.length).toBe(2);
    expectPointsEqual(segment[0], [-205.87928611598593, -208.66459926864866]);
    expectPointsEqual(segment[1], [-125.69711338790313, -208.66459926864866]);
});

test('Reading PolyLineRecord with M', async () => {
    const shpBuffer = openFileAsArray('testdata/polylineM.shp');
    const shxBuffer = openFileAsArray('testdata/polylineM.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XYM, PolyLineRecord);
    expect(geom.type).toEqual('LineString');
    expect(geom.coords.length).toBe(1);
    let segment = geom.coords[0];
    expect(segment.length).toBe(3);
    expectPointsEqual(segment[0], [39.19402681053475, -113.24564852679453, 10]);
    expectPointsEqual(segment[1], [55.850253851346736, -88.55874059130537, 20]);
    expectPointsEqual(segment[2], [64.17836737175264, -110.86618752096422, 30]);

    geom = expectGeometry(reader, 1, CoordType.XYM, PolyLineRecord);
    expect(geom.type).toEqual('LineString');
    expect(geom.coords.length).toBe(1);
    segment = geom.coords[0];
    expect(segment.length).toBe(5);
    expectPointsEqual(segment[0], [24.619828149824286, -98.96888249181285, 9]);
    expectPointsEqual(segment[1], [36.517133178975655, -138.22998908801242, 8]);
    expectPointsEqual(segment[2], [52.57849496833006, -106.10726550930372, 7]);
    expectPointsEqual(segment[3], [64.17836737175264, -140.01458484238515, 6]);
    expectPointsEqual(segment[4], [75.77823977517522, -100.75347824618558, 5]);

    geom = expectGeometry(reader, 2, CoordType.XYM, PolyLineRecord);
    expect(geom.type).toEqual('MultiLineString');
    expect(geom.coords.length).toBe(3);
    segment = geom.coords[0];
    expect(segment.length).toBe(3);
    expectPointsEqual(segment[0], [19.510528187285388, -131.68610446682828, 1]);
    expectPointsEqual(segment[1], [50.58258088958462, -148.75866089666312, 2]);
    expectPointsEqual(segment[2], [88.82510729241454, -130.3202999524416, 3]);
    segment = geom.coords[1];
    expect(segment.length).toBe(4);
    expectPointsEqual(segment[0], [6.5353853006108125, -140.5638338103425, 9]);
    expectPointsEqual(segment[1], [42.72920493186058, -158.66074362596729, 8]);
    expectPointsEqual(segment[2], [62.19191926187227, -158.66074362596729, 7]);
    expectPointsEqual(segment[3], [98.72719002171857, -135.78351800998865, 6]);
    segment = geom.coords[2];
    expect(segment.length).toBe(2);
    expectPointsEqual(segment[0], [9.949896586577893, -168.56282635527143, 100]);
    expectPointsEqual(segment[1], [99.06864115031533, -167.19702184088464, 200]);
});

test('Reading PolyLineRecord with Z', async () => {
    const shpBuffer = openFileAsArray('testdata/polylineZM.shp');
    const shxBuffer = openFileAsArray('testdata/polylineZM.shx');

    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    let geom = expectGeometry(reader, 0, CoordType.XYZM, PolyLineRecord);
    expect(geom.type).toEqual('LineString');
    expect(geom.coords.length).toBe(1);
    let segment = geom.coords[0];
    expectPointsEqual(segment[0], [-115.47093856843338, -100.45604562045679, 100, 5000]);
    expectPointsEqual(segment[1], [-96.13781789606242, -110.56875489523543, 101, 6000]);
    expectPointsEqual(segment[2], [-64.0150943173536, -95.39969098306739, 102, 7000]);
    expectPointsEqual(segment[3], [-42.8973778906099, -105.51240025784614, 103, 8000]);
    expectPointsEqual(segment[4], [-29.215477107085803, -93.91252785442344, 104, 9000]);

    geom = expectGeometry(reader, 1, CoordType.XYZM, PolyLineRecord);
    expect(geom.type).toEqual('LineString');
    expect(geom.coords.length).toBe(1);
    segment = geom.coords[0];
    expectPointsEqual(segment[0], [-112.79404493687429, -114.43537902970968, 1000, NaN]);
    expectPointsEqual(segment[1], [-89.59430013002913, -121.57376204720043, 1001, NaN]);
    expectPointsEqual(segment[2], [-67.88171845182785, -109.08159176659149, 1002, NaN]);
    expectPointsEqual(segment[3], [-38.73332113040692, -120.0865989185566, 1003, NaN]);
    expectPointsEqual(segment[4], [-23.861689843967667, -106.4046981350325, 1004, NaN]);

    geom = expectGeometry(reader, 2, CoordType.XYZM, PolyLineRecord);
    expect(geom.type).toEqual('MultiLineString');
    expect(geom.coords.length).toBe(3);
    segment = geom.coords[0];
    expectPointsEqual(segment[0], [-111.60670519384564, -126.90578866647462, 11, 1]);
    expectPointsEqual(segment[1], [-63.80354719030822, -139.19802929595573, 12, 2]);
    expectPointsEqual(segment[2], [-21.12215611572134, -115.97935255138037, 13, 3]);
    segment = geom.coords[1];
    expectPointsEqual(segment[0], [-121.85023905174648, -133.3933601098118, 9, 4]);
    expectPointsEqual(segment[1], [-74.38853217680582, -147.73430751087312, 8, 5]);
    expectPointsEqual(segment[2], [-48.77969753205366, -146.02705186788958, 7, 6]);
    expectPointsEqual(segment[3], [-13.951682415190817, -121.44257060892755, 6, 7]);
    segment = geom.coords[2];
    expectPointsEqual(
        segment[0],
        [-120.14298340876303, -147.0514052536797, 1.1000000000058208, 10]
    );
    expectPointsEqual(
        segment[1],
        [-90.43673522085055, -156.61203685438716, 1.1999999999970896, 20]
    );
    expectPointsEqual(segment[2], [-69.2667652478554, -157.97784136877394, 1.3000000000029104, 30]);
    expectPointsEqual(segment[3], [-51.16985543223046, -155.2462323400004, 1.3999999999941792, 40]);
    expectPointsEqual(segment[4], [-23.853765144494957, -143.6368939677127, 1.5, 50]);
    expectPointsEqual(
        segment[5],
        [-10.195720000627091, -131.00320220963494, 1.6000000000058208, 60]
    );
    expectPointsEqual(segment[6], [-9.512817743433743, -131.3446533382317, 1.6000000000058208, 70]);
});
