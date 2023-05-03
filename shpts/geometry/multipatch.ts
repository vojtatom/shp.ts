import { Coord, CoordType, MultiPatchCoord } from '@shpts/types/coordinate';
import { BaseRingedRecord } from './base';
import {
    GeoJsonCoord,
    GeoJsonGeom,
    GeoJsonMultiPolygon,
    GeoJsonPolygon,
} from '@shpts/types/geojson';
import { ShapeReader } from '@shpts/reader/reader';
import { GeomHeader } from '@shpts/types/data';
import { assemblePolygonsWithHoles } from '@shpts/utils/orientation';
import { GeomUtil } from '@shpts/utils/geometry';

export class MultiPatchRecord extends BaseRingedRecord {
    constructor(public coords: MultiPatchCoord, coordType: CoordType) {
        super(coordType);
    }

    static fromPresetReader(reader: ShapeReader, header: GeomHeader) {
        const hasZ = reader.hasZ;
        const hasM = reader.hasM;
        const shpStream = reader.shpStream;
        let z, m;

        MultiPatchRecord.readBbox(shpStream); //throw away the bbox
        const numParts = shpStream.readInt32(true);
        const numPoints = shpStream.readInt32(true);
        const parts = shpStream.readInt32Array(numParts, true);
        const partTypes = shpStream.readInt32Array(numParts, true);
        const xy = shpStream.readDoubleArray(numPoints * 2, true);
        if (hasZ) z = MultiPatchRecord.getZValues(shpStream, numPoints);
        if (hasM) m = MultiPatchRecord.getMValues(shpStream, numPoints);
        const coords = MultiPatchRecord.getCoords(parts, xy, z, m);
        const assembledCoords = MultiPatchRecord.assemblePolygonsWithHoles(coords, partTypes);
        return new MultiPatchRecord(
            assembledCoords as MultiPatchCoord,
            GeomUtil.coordType(header.type)
        );
    }

    private static assemblePolygonsWithHoles(coords: Coord[][], partTypes: Int32Array) {
        const polygons: Coord[][][] = [];
        const openPolygon: Coord[][] = [];

        for (let i = 0; i < partTypes.length; i++) {
            if (partTypes[i] === 0) {
                //triangle strip
                MultiPatchRecord.closePolygon(openPolygon, polygons);
                polygons.push(MultiPatchRecord.triangleStripToPolygon(coords[i]));
            } else if (partTypes[i] === 1) {
                //triangle fan
                MultiPatchRecord.closePolygon(openPolygon, polygons);
                polygons.push(MultiPatchRecord.triangleFanToPolygon(coords[i]));
            } else if (partTypes[i] === 2) {
                //outer ring
                MultiPatchRecord.closePolygon(openPolygon, polygons);
                openPolygon.push(coords[i]);
            } else if (partTypes[i] === 3) {
                //inner ring
                openPolygon.push(coords[i]);
            } else if (partTypes[i] === 4) {
                //first ring
                MultiPatchRecord.closePolygon(openPolygon, polygons);
                openPolygon.push(coords[i]);
            } else if (partTypes[i] === 5) {
                //ring
                openPolygon.push(coords[i]);
            } else {
                throw new Error(`Invalid part type in MultiPatch: ${partTypes[i]}`);
            }
        }

        MultiPatchRecord.closePolygon(openPolygon, polygons);
        return polygons;
    }

    private static closePolygon(openPolygon: Coord[][], polygons: Coord[][][]) {
        if (openPolygon.length > 0) {
            polygons.push(...assemblePolygonsWithHoles(openPolygon));
            openPolygon.length = 0;
        }
    }

    private static triangleStripToPolygon(coords: Coord[]) {
        const polygons = [];
        let offsetFirst = 2;
        let offsetSecond = 1;
        for (let i = 0; i < coords.length - 2; i++) {
            polygons.push([coords[i], coords[i + offsetFirst], coords[i + offsetSecond]]);
            offsetFirst = offsetFirst === 1 ? 2 : 1;
            offsetSecond = offsetSecond === 1 ? 2 : 1;
        }
        return polygons;
    }

    private static triangleFanToPolygon(coords: Coord[]) {
        const polygons = [];
        for (let i = 1; i < coords.length - 1; i++) {
            polygons.push([coords[0], coords[i], coords[i + 1]]);
        }
        return polygons;
    }

    toGeoJson(): GeoJsonGeom {
        const coords = [];
        const sliceParam = this.hasM ? this.coordLength - 1 : this.coordLength;
        for (const polygon of this.coords) {
            const polyCoord = [];
            for (const ring of polygon) {
                const ringCoord = [];
                for (const coord of ring) ringCoord.push(coord.slice(0, sliceParam));
                polyCoord.push(ringCoord);
            }
            coords.push(polyCoord);
        }

        if (coords.length === 1) {
            const geom: GeoJsonPolygon = {
                type: 'Polygon',
                coordinates: coords[0] as GeoJsonCoord[][],
            };
            return geom;
        }

        const geom: GeoJsonMultiPolygon = {
            type: 'MultiPolygon',
            coordinates: coords as GeoJsonCoord[][][],
        };
        return geom;
    }
}
