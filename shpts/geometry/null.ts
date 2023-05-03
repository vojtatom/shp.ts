import { GeoJsonGeom } from '@shpts/types/geojson';
import { BaseRecord } from './base';
import { CoordType } from '@shpts/types/coordinate';

export class ShpNullGeom extends BaseRecord {
    constructor() {
        super(CoordType.NULL);
    }

    public toGeoJson(): GeoJsonGeom {
        throw new Error('Method cannot be implemented.');
    }
}
