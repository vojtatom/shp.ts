import { GeoJsonFeatureCollection } from '@shpts/types/geojson';
import { Feature } from './feature';

export class FeatureCollection {
    readonly features: Feature[] = [];

    public toGeoJson(): GeoJsonFeatureCollection {
        const features = this.features.map((feature) => feature.toGeoJson());
        return {
            type: 'FeatureCollection',
            features: features,
        };
    }
}
