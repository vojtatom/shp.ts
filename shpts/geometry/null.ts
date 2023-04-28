import { ShpGeometryBase } from '@shpts/types/geometry';
import { GeoJsonGeom } from '@shpts/types/geojson';

export class ShpNullGeom extends ShpGeometryBase {
    public toGeoJson(): GeoJsonGeom {
        throw new Error('Not implemented');
    }
}
