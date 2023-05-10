import { ShapeReader } from '@shpts/reader/shpReader';
import { CoordType, PolyLineCoord } from '@shpts/types/coordinate';
import { BaseRingedRecord } from './base';
import { GeoJsonCoord, GeoJsonLineString, GeoJsonMultiLineString } from '@shpts/types/geojson';
import { GeomUtil } from '@shpts/utils/geometry';
import { GeomHeader } from '@shpts/types/data';

export class PolyLineRecord extends BaseRingedRecord {
    constructor(public coords: PolyLineCoord, coordType: CoordType) {
        super(coordType);
    }

    get type() {
        if (this.coords.length === 1) return 'LineString';
        return 'MultiLineString';
    }

    static fromPresetReader(reader: ShapeReader, header: GeomHeader) {
        const hasZ = reader.hasZ;
        const hasM = reader.hasM;
        const shpStream = reader.shpStream;
        let z, m;

        PolyLineRecord.readBbox(shpStream); //throw away the bbox
        const numParts = shpStream.readInt32(true);
        const numPoints = shpStream.readInt32(true);
        const parts = shpStream.readInt32Array(numParts, true);
        const xy = shpStream.readDoubleArray(numPoints * 2, true);
        if (hasZ) z = PolyLineRecord.getZValues(shpStream, numPoints);
        if (hasM) m = PolyLineRecord.getMValues(shpStream, numPoints);
        const coords = PolyLineRecord.getCoords(parts, xy, z, m);
        return new PolyLineRecord(coords as PolyLineCoord, GeomUtil.coordType(header.type));
    }

    toGeoJson() {
        const coords = [];
        const sliceParam = this.hasM ? this.coordLength - 1 : this.coordLength;
        for (const line of this.coords) {
            const lineCoord = [];
            for (const coord of line) lineCoord.push(coord.slice(0, sliceParam));
            coords.push(lineCoord);
        }

        if (coords.length === 1) {
            const geom: GeoJsonLineString = {
                type: 'LineString',
                coordinates: coords[0] as GeoJsonCoord[],
            };
            return geom;
        }

        const geom: GeoJsonMultiLineString = {
            type: 'MultiLineString',
            coordinates: coords as GeoJsonCoord[][],
        };
        return geom;
    }
}
