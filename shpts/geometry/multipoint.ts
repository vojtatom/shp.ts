import { ShapeReader } from '@shpts/reader/reader';
import { CoordType, MultiPointCoord } from '@shpts/types/coordinate';
import { BaseRecord } from './base';
import { GeoJsonCoord, GeoJsonMultiPoint } from '@shpts/types/geojson';
import { GeomUtil } from '@shpts/utils/geometry';
import { GeomHeader } from '@shpts/types/data';
import { MemoryStream } from '@shpts/utils/stream';

export class MultiPointRecord extends BaseRecord {
    constructor(public coords: MultiPointCoord, coordType: CoordType) {
        super(coordType);
    }

    static fromPresetReader(reader: ShapeReader, header: GeomHeader) {
        const hasZ = reader.hasZ;
        const hasM = reader.hasM;
        const shpStream = reader.shpStream;
        let z, m;

        MultiPointRecord.readBbox(shpStream); //throw away the bbox
        const numPoints = shpStream.readInt32(true);
        const xy = shpStream.readDoubleArray(numPoints * 2, true);
        if (hasZ) z = MultiPointRecord.getZValues(shpStream, numPoints);
        if (hasM) m = MultiPointRecord.getMValues(shpStream, numPoints);
        const coords = MultiPointRecord.getCoords(numPoints, xy, z, m);
        return new MultiPointRecord(coords as MultiPointCoord, GeomUtil.coordType(header.type));
    }

    private static getZValues(shpStream: MemoryStream, numPoints: number) {
        shpStream.readDouble(true); // skip zMin
        shpStream.readDouble(true); // skip zMax
        return shpStream.readDoubleArray(numPoints, true);
    }

    private static getMValues(shpStream: MemoryStream, numPoints: number) {
        shpStream.readDouble(true); // skip mMin
        shpStream.readDouble(true); // skip mMax
        return shpStream.readDoubleArray(numPoints, true);
    }

    private static getCoords(
        numPoints: number,
        xy: Float64Array,
        z?: Float64Array,
        m?: Float64Array
    ) {
        const coords: number[][] = [];
        for (let i = 0; i < numPoints; i++) {
            const coord = [];
            coord.push(xy[i * 2]);
            coord.push(xy[i * 2 + 1]);
            if (z) coord.push(z[i]);
            if (m) coord.push(m[i]);
            coords.push(coord);
        }
        return coords;
    }

    toGeoJson() {
        const coords = [];
        const sliceParam = this.hasM ? this.coordLength - 1 : this.coordLength;
        for (const coord of this.coords) coords.push(coord.slice(0, sliceParam));

        const geom: GeoJsonMultiPoint = {
            type: 'MultiPoint',
            coordinates: coords as GeoJsonCoord[],
        };

        return geom;
    }
}
