export class MemoryStream {
    private dataView: DataView;
    private offset: number = 0;
    private size: number = 0;

    get tell(): number {
        return this.offset;
    }

    constructor(buffer: ArrayBuffer) {
        this.size = buffer.byteLength;
        this.dataView = new DataView(buffer);
    }

    seek(offset: number): MemoryStream {
        if (offset > this.size + 1) {
            throw new Error('Offset out of bounds');
        }
        this.offset = offset;
        return this;
    }

    readInt16(littleEndian?: boolean): number {
        const result = this.dataView.getInt16(this.offset, littleEndian);
        this.offset += 4;
        return result;
    }

    readInt32(littleEndian?: boolean): number {
        const result = this.dataView.getInt32(this.offset, littleEndian);
        this.offset += 4;
        return result;
    }

    readInt32Array(count: number, littleEndian?: boolean): Int32Array {
        const result = new Int32Array(count);
        for (let i = 0; i < count; i++) {
            result[i] = this.readInt32(littleEndian);
        }
        return result;
    }

    readDouble(littleEndian?: boolean): number {
        const result = this.dataView.getFloat64(this.offset, littleEndian);
        this.offset += 8;
        return result;
    }

    readDoubleArray(count: number, littleEndian?: boolean): Float64Array {
        const result = new Float64Array(count);
        for (let i = 0; i < count; i++) {
            result[i] = this.readDouble(littleEndian);
        }
        return result;
    }

    /* Returns value at curent pos without advancing */
    peekByte(): number {
        return this.dataView.getUint8(this.offset);
    }

    readByte(): number {
        const result = this.dataView.getUint8(this.offset);
        this.offset += 1;
        return result;
    }
}
