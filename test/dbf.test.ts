import { DbfFieldDescr, DbfFieldType } from '@shpts/types/dbfTypes';
import { expect, test } from 'vitest';
import { openFileAsArray } from './utils';
import { DbfReader } from '@shpts/reader/dbfReader';

function expectField(
    field: DbfFieldDescr,
    name: string,
    type: DbfFieldType,
    typeName: string,
    fieldLen: number,
    decimals: number
) {
    expect(field.name).toEqual(name);
    expect(field.type).toEqual(type);
    expect(field.typeName).toEqual(typeName);
    expect(field.fieldLen).toEqual(fieldLen);
    expect(field.decimalCount).toEqual(decimals);
}

test('DBF all field types UTF8', async () => {
    const cpgFile = openFileAsArray('testdata/attr_types.CPG');
    const dbfFile = openFileAsArray('testdata/attr_types.dbf');
    const reader = await DbfReader.fromArrayBuffer(dbfFile, cpgFile);
    const fields = reader.fields;
    expect(fields.length).toEqual(6);
    expect(reader.encoding).toEqual('utf8');

    expectField(fields[0], 'float', 'F', 'Float', 13, 11);
    expectField(fields[1], 'double', 'F', 'Float', 19, 11);
    expectField(fields[2], 'text', 'C', 'Character', 50, 0);
    expectField(fields[3], 'date', 'D', 'Date', 8, 0);
    expectField(fields[4], 'long', 'N', 'Number', 10, 0);
    expectField(fields[5], 'short', 'N', 'Number', 5, 0);

    let record = reader.readRecord(0);
    expect(record[0]).toBeCloseTo(123.123);
    expect(record[1]).toBeCloseTo(1.123456789);
    expect(record[2]).toEqual('Some text');
    expect(record[3].getTime()).toEqual(new Date(2021, 0, 15).getTime());
    expect(record[4]).toEqual(55555555);
    expect(record[5]).toEqual(44444);

    // This DBF is UTF-8 encoded, test with Norwegian and German characters
    record = reader.readRecord(1);
    expect(record[2]).toEqual('Norwegian ÆØÅ');
    record = reader.readRecord(2);
    expect(record[2]).toEqual('German ÄÖÜẞ');
});

test('DBF codepage 865', async () => {
    // This example has no separate .CPG-file, encoding specified in file header
    // Test with Norwegian letters ÆØÅ
    const dbfFile = openFileAsArray(`testdata/dbf_codepage/cp865.dbf`);
    const reader = await DbfReader.fromArrayBuffer(dbfFile);
    const fields = reader.fields;
    expect(fields.length).toEqual(2);
    expect(reader.recordCount).toEqual(3);
    expect(reader.encoding).toEqual('cp865');
    const row = reader.readRecord(2);
    expect(row[1]).toEqual('æøåÆØÅ');
});

test('DBF codepage 1252', async () => {
    // Test with Norwegian letters ÆØÅ
    const cpgFile = openFileAsArray(`testdata/dbf_codepage/cp1252.CPG`);
    const dbfFile = openFileAsArray(`testdata/dbf_codepage/cp1252.dbf`);
    const reader = await DbfReader.fromArrayBuffer(dbfFile, cpgFile);
    const fields = reader.fields;
    expect(fields.length).toEqual(2);
    expect(reader.recordCount).toEqual(3);
    expect(reader.encoding).toEqual('cp1252');
    const row = reader.readRecord(1);
    expect(row[1]).toEqual('ÆØÅæøå');
});

test('DBF ISO-8859-1', async () => {
    // Test with Norwegian letters ÆØÅ
    const cpgFile = openFileAsArray(`testdata/dbf_codepage/cp88591.cpg`);
    const dbfFile = openFileAsArray(`testdata/dbf_codepage/cp88591.dbf`);
    const reader = await DbfReader.fromArrayBuffer(dbfFile, cpgFile);
    expect(reader.encoding).toEqual('ISO-8859-1');
    const fields = reader.fields;
    expect(fields.length).toEqual(2);
    expect(reader.recordCount).toEqual(3);
    const row = reader.readRecord(2);
    expect(row[1]).toEqual('ÆØÅæøå');
});
