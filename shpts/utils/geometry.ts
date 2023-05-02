import { CoordType } from '../types/coordinate';
import { GeoJsonGeom } from '../types/geojson';

/* eslint-disable  no-unused-vars */
export enum ShapeType {
    Null = 0,
    Point = 1,
    PolyLine = 3,
    Polygon = 5,
    MultiPoint = 8,
    PointZ = 11,
    PolyLineZ = 13,
    PolygonZ = 15,
    MultiPointZ = 18,
    PointM = 21,
    PolyLineM = 23,
    PolygonM = 25,
    MultiPointM = 28,
    MultiPatch = 31,
}
/* eslint-enable  no-unused-vars */

export class GeomUtil {
    static coordType(shapeType: ShapeType): CoordType {
        if (shapeType === 0) {
            return CoordType.NULL;
        } else if (shapeType < 10) {
            return CoordType.XY;
        } else if (shapeType < 20) {
            return CoordType.XYZM;
        } else if (shapeType < 30) {
            return CoordType.XYM;
        } else if (shapeType < 40) {
            return CoordType.XYZM;
        }
        return CoordType.NULL;
    }

    static hasZ(shapeType: ShapeType): boolean {
        const type = GeomUtil.coordType(shapeType);
        return type === CoordType.XYZM;
    }

    static hasM(shapeType: ShapeType): boolean {
        const type = GeomUtil.coordType(shapeType);
        return type === CoordType.XYZM || type === CoordType.XYM;
    }

    static shapeTypeStr(shapeType: ShapeType): string {
        if (shapeType in ShapeType) {
            return ShapeType[shapeType];
        }
        return 'Unknown';
    }
}

// According to Shape spec, M values less than this is NaN
export const mNaN = -Math.pow(-10, 38);
