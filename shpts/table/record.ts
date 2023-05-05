import { DbfFieldDescr } from '@shpts/types/dbfTypes';
import { MemoryStream } from '@shpts/utils/stream';
import { DbfDecoder } from './decoder';

export class DbfRecord {
    private static regExDate = /^(\d\d\d\d)(\d\d)(\d\d)$/;

    static fromPresetStream(stream: MemoryStream, fields: DbfFieldDescr[], decoder: DbfDecoder) {
        const deletedFlag = stream.readByte();
        const result: Array<any> = [];

        if (deletedFlag === 0x2a) {
            // Deleted record, fill with null
            fields.forEach(() => result.push(null));
            return result;
        }

        let offset = stream.tell;
        fields.forEach((field) => {
            stream.seek(offset);
            switch (field.type) {
                case 'C':
                    result.push(DbfRecord.readCharValue(stream, field, decoder));
                    break;
                case 'N':
                    result.push(DbfRecord.readNumberValue(stream, field, decoder));
                    break;
                case 'F':
                    result.push(DbfRecord.readNumberValue(stream, field, decoder));
                    break;
                case 'D':
                    result.push(DbfRecord.readDateValue(stream, field, decoder));
                    break;
                case 'L':
                    result.push(DbfRecord.readLogicalValue(stream));
                    break;
                default:
                    result.push(null);
            }
            offset += field.fieldLen;
        });
        return result;
    }

    private static readCharValue(
        stream: MemoryStream,
        field: DbfFieldDescr,
        decoder: DbfDecoder
    ): string {
        const chars: Uint8Array = new Uint8Array(field.fieldLen);
        for (let i = 0; i < field.fieldLen; i++) {
            const charCode = stream.readByte();
            if (charCode === 0) {
                break;
            }
            chars[i] = charCode;
        }
        const value = decoder.decode(Buffer.from(chars));
        return value.trim();
    }

    private static readNumberValue(
        stream: MemoryStream,
        field: DbfFieldDescr,
        decoder: DbfDecoder
    ): number {
        const val = this.readCharValue(stream, field, decoder);
        if (field.decimalCount === 0) {
            return parseInt(val);
        }
        return parseFloat(val);
    }

    private static readDateValue(
        stream: MemoryStream,
        field: DbfFieldDescr,
        decoder: DbfDecoder
    ): Date | null {
        const strVal = this.readCharValue(stream, field, decoder);
        const m = strVal.match(DbfRecord.regExDate);
        if (m == null) {
            return null;
        }
        return new Date(+m[1], +m[2], +m[3]);
    }

    private static readLogicalValue(stream: MemoryStream): boolean | null {
        const charCode = stream.readByte();
        switch (String.fromCharCode(charCode)) {
            case 'y':
            case 'Y':
                return true;
            case 'n':
            case 'N':
                return false;
        }
        return null;
    }
}
