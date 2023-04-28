import { expect, test } from 'vitest';
import { ShapeReader } from '@shpts/reader/reader';
import fs from 'fs';

const shp = 'test/data/points/FSV_Kultura_b.shp';
const shx = 'test/data/points/FSV_Kultura_b.shx';

test('should open points', async () => {
    const shpBuffer = fs.readFileSync(shp).buffer;
    const shxBuffer = fs.readFileSync(shx).buffer;
    const reader = await ShapeReader.fromArrayBuffer(shpBuffer, shxBuffer);

    for (let i = 0; i < reader.recordCount; i++) {
        const record = reader.readGeom(i);
        console.log(record);
    }
});
