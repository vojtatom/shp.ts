import { MemoryStream } from '@shpts/utils/stream';
import { DbfFieldDescr, DbfFieldType, DbfHeader } from '@shpts/types/dbfTypes';
import { DbfDecoder, fromCpgString, fromDbfLangCode } from '@shpts/table/decoder';
import { DbfRecord } from '@shpts/table/record';

const FieldTypeNames: any = {
    C: 'Character',
    N: 'Number',
    L: 'Logical',
    F: 'Float',
    D: 'Date',
};

export class DbfReader {
    readonly stream: MemoryStream;
    private header: DbfHeader;
    readonly fields: DbfFieldDescr[] = [];
    private recordStartOffset: number = 0;
    private recordSize: number = 0;
    private decoder?: DbfDecoder;

    get recordCount(): number {
        return this.header.recordCount;
    }

    get encoding(): string {
        return this.decoder?.encoding ?? '';
    }

    private constructor(dbf: ArrayBuffer, decoder?: DbfDecoder) {
        this.stream = new MemoryStream(dbf);
        this.decoder = decoder; /* If not provided, it will be created from header info below */
        this.header = this.readHeader();
    }

    static async fromFile(file: File, cpgFile?: File) {
        const buffer = await file.arrayBuffer();
        let cpgBuf: ArrayBuffer | undefined;
        if (cpgFile) cpgBuf = await cpgFile.arrayBuffer();
        return this.fromArrayBuffer(buffer, cpgBuf);
    }

    static async fromArrayBuffer(buffer: ArrayBuffer, cpgBuf?: ArrayBuffer) {
        let decoder: DbfDecoder | undefined;
        if (cpgBuf) {
            const cpgDecoder = new TextDecoder();
            const cpgStr = await cpgDecoder.decode(cpgBuf);
            decoder = fromCpgString(cpgStr);
        }
        return new DbfReader(buffer, decoder);
    }

    private readHeader(): DbfHeader {
        const s = this.stream;
        s.seek(0);
        const version = s.readByte();
        const updatedY = s.readByte();
        const updatedM = s.readByte();
        const updatedD = s.readByte();
        const recordCount = s.readInt32(true);
        s.readInt16(true); // skip headerSize
        s.readInt16(true); // skip recordSize ( can't be trusted, may be 0 for some reason)
        const lang = s.seek(29).readByte();
        if (!this.decoder) this.decoder = fromDbfLangCode(lang);
        this.readFields(s);
        this.computeRecordSize(s);

        return {
            lastUpdated: new Date(updatedY + 1900, updatedM, updatedD),
            recordCount: recordCount,
            version: version,
        };
    }

    private computeRecordSize(s: MemoryStream) {
        this.recordSize = 1; // Count "deleted" byte as well
        this.fields.forEach((field) => (this.recordSize += field.fieldLen));
        s.readByte();
        this.recordStartOffset = s.tell;
    }

    private readFields(s: MemoryStream) {
        let recordIdx = 32;
        while (true) {
            s.seek(recordIdx);
            const firstByte = s.peekByte();
            if (firstByte === 0x0d) {
                break;
            }
            let fieldName = '';
            for (let i = 0; i < 10; i++) {
                const charCode = s.readByte();
                if (charCode === 0) {
                    break;
                }
                fieldName += String.fromCharCode(charCode);
            }
            fieldName = fieldName.trim();
            s.seek(recordIdx + 11);
            const fieldTypeCode = s.readByte();
            const fieldType: DbfFieldType = String.fromCharCode(fieldTypeCode) as DbfFieldType;
            s.seek(recordIdx + 16);
            const fieldLen = s.readByte();
            const decimals = s.readByte();

            const field: DbfFieldDescr = {
                name: fieldName,
                type: fieldType,
                typeName: FieldTypeNames[fieldType] || 'Unknown',
                fieldLen: fieldLen,
                decimalCount: decimals,
            };
            this.fields.push(field);
            recordIdx += 32;
        }
    }

    readRecord(index: number) {
        let offset = this.recordStartOffset + index * this.recordSize;
        this.stream.seek(offset);
        if (!this.decoder) throw new Error('Decoder not initialized');
        return DbfRecord.fromPresetStream(this.stream, this.fields, this.decoder);
    }
}
