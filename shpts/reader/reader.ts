import { ShpNullGeom } from '@shpts/geometry/null';
import { GeomUtil, ShapeType, ShpGeometry } from '@shpts/types/geometry';
import { BoundingBox, GeomHeader, PartsInfo, ShpHeader } from '@shpts/types/types';
import { MemoryStream } from '@shpts/utils/stream';

export class ShapeReader {
    private _shxStream: MemoryStream;
    private _shpStream: MemoryStream;
    private _shxHeader: ShpHeader;
    private _shpHeader: ShpHeader;

    readonly recordCount: number = 0;

    readonly hasZ: boolean;

    readonly hasM: boolean;

    public get extent(): BoundingBox {
        return this._shpHeader!.extent;
    }

    public get shapeType(): ShapeType {
        return this._shpHeader!.type;
    }

    public get shpHeader(): ShpHeader {
        return this._shpHeader!;
    }

    private constructor(shp: ArrayBuffer, shx: ArrayBuffer) {
        this._shpStream = new MemoryStream(shp);
        this._shpHeader = this._readHeader(this._shpStream);
        this._shxStream = new MemoryStream(shx);
        this._shxHeader = this._readHeader(this._shxStream);
        if (this._shpHeader.type !== this._shxHeader.type) {
            throw new Error('SHP / SHX shapetype mismatch');
        }
        this.recordCount = (this._shxHeader.fileLength - 100) / 8;
        this.hasZ = GeomUtil.hasZ(this._shpHeader.type);
        this.hasM = GeomUtil.hasM(this._shpHeader.type);
    }

    public static async fromFile(shp: File, shx: File): Promise<ShapeReader> {
        if (shp == null) {
            throw new Error('No .shp file provided');
        }
        if (shx == null) {
            throw new Error('No .shx file provided');
        }
        let shpBytes: ArrayBuffer;
        let shxBytes: ArrayBuffer;
        try {
            shpBytes = await shp.arrayBuffer();
        } catch (err: any) {
            throw new Error(`Failed to open .shp: ${err.message}`);
        }
        try {
            shxBytes = await shx.arrayBuffer();
        } catch (err: any) {
            throw new Error(`Failed to open .shp: ${err.message}`);
        }
        return this.fromArrayBuffer(shpBytes, shxBytes);
    }

    public static async fromArrayBuffer(
        shpBytes: ArrayBuffer,
        shxBytes: ArrayBuffer
    ): Promise<ShapeReader> {
        return new ShapeReader(shpBytes, shxBytes);
    }

    /* Used for both .shp and .shx */
    private _readHeader(stream: MemoryStream): ShpHeader {
        const version = stream.seek(0).readInt32();
        if (version !== 9994) {
            throw new Error('Unexpected Shape version');
        }

        const fileLen = stream.seek(24).readInt32();
        const shpType = stream.seek(32).readInt32(true);
        stream.seek(36);
        const extent = this._readBbox(stream);
        const result = {
            type: shpType as ShapeType,
            fileLength: fileLen * 2,
            extent: extent,
        };
        return result;
    }

    private _readGeomHeader(): GeomHeader {
        const recNum = this._shpStream.readInt32(false);
        const len = this._shpStream.readInt32(false);
        const type: ShapeType = this._shpStream.readInt32(true) as ShapeType;
        return {
            length: len,
            recordNum: recNum,
            type: type,
        };
    }

    private _readBbox(stream: MemoryStream): BoundingBox {
        const xMin = stream.readDouble(true);
        const yMin = stream.readDouble(true);
        const xMax = stream.readDouble(true);
        const yMax = stream.readDouble(true);
        return {
            xMin: xMin,
            yMin: yMin,
            xMax: xMax,
            yMax: yMax,
        };
    }

    private _getShpIndex(index: number): number {
        const offs = index * 8 + 100;
        const shpOffset = this._shxStream.seek(offs).readInt32(false) * 2;
        return shpOffset;
    }

    public readGeom(geomIndex: number) {
        const offset = this._getShpIndex(geomIndex);
        this._shpStream.seek(offset);
        const recHead = this._readGeomHeader();

        if (this._shpHeader.type !== recHead.type) {
            if (recHead.type === ShapeType.Null) {
                return new ShpNullGeom(recHead.type);
            }
            throw new Error(
                `Unexpected shape type ${GeomUtil.shapeTypeStr(recHead.type)}(${
                    recHead.type as number
                }), expected ${GeomUtil.shapeTypeStr(this._shpHeader.type)}`
            );
        }
        switch (recHead.type) {
            case ShapeType.Point:
            case ShapeType.PointZ:
            case ShapeType.PointM:
                return this._readPoint(recHead);

            case ShapeType.MultiPoint:
            case ShapeType.MultiPointZ:
            case ShapeType.MultiPointM:
                return this._readMultiPoint(recHead);

            case ShapeType.PolyLine:
            case ShapeType.PolyLineZ:
            case ShapeType.PolyLineM:
                return this._readPolyLine(recHead);

            case ShapeType.Polygon:
            case ShapeType.PolygonZ:
            case ShapeType.PolygonM:
                return this._readPolygon(recHead);

            case ShapeType.MultiPatch:
                return this._readMultiPatch(recHead);
        }
        throw new Error('Unsupported geometry');
    }

    private _readPoint(header: GeomHeader) {
        //TODO
        return header;
    }

    private _readMultiPoint(header: GeomHeader) {
        //TODO
        return header;
    }

    private _readPolyLine(header: GeomHeader) {
        //TODO
        return header;
    }

    private _readPolygon(header: GeomHeader) {
        //TODO
        return header;
    }

    private _readMultiPatch(header: GeomHeader) {
        //TODO
        return header;
    }
}
