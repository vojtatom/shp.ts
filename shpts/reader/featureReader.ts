import { Feature } from '@shpts/features/feature';
import { DbfReader } from './dbfReader';
import { ShapeReader } from './shpReader';
import { FeatureCollection } from '@shpts/features/featureCollection';

export class FeatureReader {
    private shpReader: ShapeReader;
    private dbfReader?: DbfReader;

    public get featureCount(): number {
        return this.shpReader!.recordCount;
    }

    public get fields() {
        return this.dbfReader?.fields;
    }

    public get shpHeader() {
        return this.shpReader.shpHeader;
    }

    private constructor(shapeFile: ShapeReader, dbfReader?: DbfReader) {
        if (shapeFile.recordCount !== dbfReader?.recordCount) {
            throw new Error(
                `Record count mismatch: SHP-file has ${shapeFile.recordCount} records, DBF has ${dbfReader?.recordCount}`
            );
        }
        this.shpReader = shapeFile;
        this.dbfReader = dbfReader;
    }

    public static async fromArrayBuffers(
        shp: ArrayBuffer,
        shx: ArrayBuffer,
        dbf?: ArrayBuffer,
        cpg?: ArrayBuffer
    ) {
        const shapeReader = await ShapeReader.fromArrayBuffer(shp, shx);
        let dbfReader: DbfReader | undefined;
        if (dbf != null) dbfReader = await DbfReader.fromArrayBuffer(dbf, cpg);
        return new FeatureReader(shapeReader, dbfReader);
    }

    public static async fromFiles(shp: File, shx: File, dbf?: File, cpg?: File) {
        const shapeReader = await ShapeReader.fromFile(shp, shx);
        let dbfReader: DbfReader | undefined;
        if (dbf != null) dbfReader = await DbfReader.fromFile(dbf, cpg);
        return new FeatureReader(shapeReader, dbfReader);
    }

    public readFeature(index: number) {
        if (index < 0 || index > this.featureCount - 1)
            throw new Error('Feature index out of range');

        const geom = this.shpReader.readGeom(index);
        let attrs = [];
        if (this.dbfReader != null) attrs = this.dbfReader.readRecord(index);

        return new Feature(geom, attrs, this.dbfReader?.fields);
    }

    public readFeatureCollection() {
        const collection = new FeatureCollection();
        for (let i = 0; i < this.featureCount; i++) {
            const feature = this.readFeature(i);
            collection.features.push(feature);
        }
        return collection;
    }
}
