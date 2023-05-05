import { BaseRecord } from '@shpts/geometry/base';
import { DbfFieldDescr } from '@shpts/types/dbfTypes';
import { GeoJsonFeature } from '@shpts/types/geojson';

export class Feature {
    readonly geom: BaseRecord;
    readonly properties: { [key: string]: any } = {};

    constructor(geom: BaseRecord, attributes?: Array<any>, fieldInfo?: Array<DbfFieldDescr>) {
        this.geom = geom;
        if (!attributes || !fieldInfo) return;

        for (let i = 0; i < fieldInfo.length; i++) {
            this.properties[fieldInfo[i].name] = attributes[i];
        }
    }

    public toGeoJson(): GeoJsonFeature {
        return {
            geometry: this.geom.toGeoJson(),
            properties: this.properties,
            type: 'Feature',
        };
    }
}
