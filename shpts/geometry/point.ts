import { ShapeReader } from '@shpts/reader/reader';
import { CoordType, PointCoord } from '@shpts/types/coordinate';
import { BaseRecord } from './base';
import { GeoJsonCoord, GeoJsonPoint } from '@shpts/types/geojson';
import { GeomHeader } from '@shpts/types/data';
import { GeomUtil } from '@shpts/utils/geometry';

export class PointRecord extends BaseRecord {
    constructor(public coords: PointCoord, coordType: CoordType) {
        super(coordType);
    }

    static fromPresetReader(reader: ShapeReader, header: GeomHeader) {
        const hasZ = reader.hasZ;
        const hasM = reader.hasM;

        const shpStream = reader.shpStream;

        const coord = [];
        coord.push(shpStream.readDouble(true)); //x
        coord.push(shpStream.readDouble(true)); //y

        if (hasM) {
            if (hasZ) {
                coord.push(shpStream.readDouble(true)); //z
            }
            coord.push(shpStream.readDouble(true)); //m
        }

        return new PointRecord(coord as PointCoord, GeomUtil.coordType(header.type));
    }

    toGeoJson() {
        const sliceParam = this.hasM ? this.coordLength - 1 : this.coordLength;
        const coords = this.coords.slice(0, sliceParam);

        const geom: GeoJsonPoint = {
            type: 'Point',
            coordinates: coords as GeoJsonCoord,
        };
        return geom;
    }
}
