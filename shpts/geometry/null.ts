import { GeoJsonGeom } from '@shpts/types/geojson';

export class ShpNullGeom {
    public toGeoJson(): GeoJsonGeom {
        throw new Error('Not implemented');
    }
}
