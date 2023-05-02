/* eslint-disable  no-unused-vars */
export enum CoordType {
    NULL = 0,
    XY = 2,
    XYM = 3,
    XYZM = 4,
}

export type CoordXY = [number, number];
export type CoordXYZ = [number, number, number];
export type CoordXYZM = [number, number, number, number];
export type Coord = CoordXY | CoordXYZ | CoordXYZM;
export type PointCoord = Coord;
export type MultiPointCoord = Coord[];
export type PolyLineCoord = Coord[][];
export type Ring = Coord[];
export type PolygonCoord = Coord[][][];
