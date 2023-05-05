import { expect, test } from 'vitest';
import { expectPointsEqual, openFileAsArray } from './utils';
import { FeatureReader } from '@shpts/reader/featureReader';
import { PolyLineRecord } from '@shpts/geometry/polyline';

test('Read feature OK', async () => {
    const shp = openFileAsArray('testdata/featureclass.shp');
    const shx = openFileAsArray('testdata/featureclass.shx');
    const dbf = openFileAsArray('testdata/featureclass.dbf');
    const cpg = openFileAsArray('testdata/featureclass.cpg');
    const reader = await FeatureReader.fromArrayBuffers(shp, shx, dbf, cpg);
    expect(reader.featureCount).toEqual(7);
    expect(reader.fields?.length).toEqual(2);
    expect(reader.fields?.at(0)?.name).toEqual('Id');
    expect(reader.fields?.at(1)?.name).toEqual('name');

    const feature = reader.readFeature(1);
    expect(feature.geom).not.toBeNull();
    expect(feature.properties).not.toBeNull();

    // Verify geometry
    expect(feature.geom instanceof PolyLineRecord).toBeTruthy();
    const polyLine = feature.geom as PolyLineRecord;
    expect(polyLine.coords.length).toEqual(1);
    const segment = polyLine.coords[0];

    expectPointsEqual(segment[0], [-117.3470458984375, -40.57794189453125]);
    expectPointsEqual(segment[1], [-93.57977294921875, -42.8712158203125]);
    expectPointsEqual(segment[2], [-96.52655029296875, -73.41015625]);
    expectPointsEqual(segment[3], [-120.293701171875, -71.11688232421875]);
    expectPointsEqual(segment[4], [-117.3470458984375, -40.57794189453125]);

    // Verify attributes
    expect(feature.properties['Id']).toEqual(0);
    expect(feature.properties['name']).toEqual('feature 1');
});

test('Read feature collection', async () => {
    const shp = openFileAsArray('testdata/featureclass.shp');
    const shx = openFileAsArray('testdata/featureclass.shx');
    const dbf = openFileAsArray('testdata/featureclass.dbf');
    const cpg = openFileAsArray('testdata/featureclass.cpg');
    const reader = await FeatureReader.fromArrayBuffers(shp, shx, dbf, cpg);
    const collection = reader.readFeatureCollection();
    expect(collection.features.length).toEqual(7);
    expect(reader.fields?.length).toEqual(2);

    collection.features.forEach((feature) => {
        expect(feature.geom).not.toBeNull();
        expect(feature.properties).not.toBeNull();
        expect(Object.keys(feature.properties).length).toEqual(2);
        expect(feature.geom instanceof PolyLineRecord).toBeTruthy();
    });
});

test('SHP and DBF count mismatch', async () => {
    const shp = openFileAsArray('testdata/polyline.shp');
    const shx = openFileAsArray('testdata/polyline.shx');
    const dbf = openFileAsArray('testdata/featureclass.dbf');
    expect(async () => {
        await FeatureReader.fromArrayBuffers(shp, shx, dbf);
    }).rejects.toThrowError('Record count mismatch: SHP-file has 3 records, DBF has 7');
});
