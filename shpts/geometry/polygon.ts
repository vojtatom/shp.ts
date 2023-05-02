import { ShapeReader } from '@shpts/reader/reader';
import { Coord, CoordType, PolygonCoord } from '@shpts/types/coordinate';
import { BaseRingedRecord } from './base';
import { GeoJsonGeom } from '@shpts/types/geojson';
import { GeomUtil } from '@shpts/utils/geometry';
import { GeomHeader } from '@shpts/types/data';
import { isClockwise, isRingInRing } from '@shpts/utils/orientation';

export class PolygonRecord extends BaseRingedRecord {
    constructor(public coords: PolygonCoord, coordType: CoordType) {
        super(coordType);
    }

    static fromPresetReader(reader: ShapeReader, header: GeomHeader) {
        const hasZ = reader.hasZ;
        const hasM = reader.hasM;
        const shpStream = reader.shpStream;
        let z, m;

        PolygonRecord.readBbox(shpStream); //throw away the bbox
        const numParts = shpStream.readInt32(true);
        const numPoints = shpStream.readInt32(true);
        const parts = shpStream.readInt32Array(numParts, true);
        const xy = shpStream.readDoubleArray(numPoints * 2, true);
        if (hasZ) z = PolygonRecord.getZValues(shpStream, numPoints);
        if (hasM) m = PolygonRecord.getMValues(shpStream, numPoints);
        const coords = PolygonRecord.getCoords(parts, xy, z, m);
        const orderedCoords = PolygonRecord.assemblePolygonsWithHoles(coords);
        return new PolygonRecord(orderedCoords as PolygonCoord, GeomUtil.coordType(header.type));
    }

    static assemblePolygonsWithHoles(coords: Coord[][]) {
        const clockwiseRings: Coord[][] = [];
        const unusedHoldes: Coord[][] = [];

        for (const ring of coords) {
            if (isClockwise(ring)) clockwiseRings.push(ring);
            else unusedHoldes.push(ring);
        }

        const polygons: PolygonCoord = [];
        for (const clockwiseRing of clockwiseRings) {
            const polygon = [clockwiseRing];
            for (let i = unusedHoldes.length - 1; i >= 0; i--) {
                if (isRingInRing(clockwiseRing, unusedHoldes[i])) {
                    polygon.push(unusedHoldes[i]);
                    unusedHoldes.splice(i, 1);
                }
            }
            polygons.push(polygon);
        }

        if (unusedHoldes.length) {
            console.warn('Some holes are not in any polygon, inserting as individual polygons.');
            polygons.push(...unusedHoldes.map((ring) => [ring]));
        }

        return polygons;
    }

    toGeoJson(): GeoJsonGeom {
        throw new Error('Method not implemented.');
    }
}
