# SHP.ts 🗺️

<sup>⚠️☕️ Careful, still hot, very early stages of development, consume with caution</sup>

TypeScript package for loading Esri Shapefiles.

-   ✅ returns a geojson-like representation
-   ✅ supports all shape types (including MultiPatch) per [Esri Shapefile specification](https://www.esri.com/content/dam/esrisites/sitecore-archive/Files/Pdfs/library/whitepapers/pdfs/shapefile.pdf)
-   ✅ supports X, Y, Z, and M coordinates
-   ✅ uses vitest 🧪 for testing

## Usage

```typescript
import { FeatureReader } from 'shpts';

const shp = 'testdata/featureclass.shp';
const shx = 'testdata/featureclass.shx';
const dbf = 'testdata/featureclass.dbf';
const cpg = 'testdata/featureclass.cpg';

const reader = await FeatureReader.fromFiles(shp, shx, dbf, cpg);
//alternatively you can use FeatureReader.fromArrayBuffers()

const features = await reader.readFeatureCollection();
const geojson = features.toGeoJson();
```

or you can read only the geoemtry:

```typescript
import { ShapeReader } from 'shpts';

const shp = 'testdata/featureclass.shp';
const shx = 'testdata/featureclass.shx';

const reader = await ShapeReader.fromFiles(shp, shx);
//alternatively you can use ShapeReader.fromArrayBuffers()

const index = 0;
const shape = reader.readGeom(index);
const geojson = shape.toGeoJson();
```

or you can read only the properties:

```typescript
import { DbfReader } from 'shpts';

const dbf = 'testdata/featureclass.dbf';
const cpg = 'testdata/featureclass.cpg';

const reader = await DbfReader.fromFiles(dbf, cpg);
//alternatively you can use DbfReader.fromArrayBuffers()

const index = 0;
const properties = reader.readRecord(index);
console.log(properties);
```

## Credits

-   insipred by https://github.com/oyvindi/ts-shapefile (MIT Licence), uses all of its test data, partially uses its code
-   inspired by https://github.com/GeospatialPython/pyshp (MIT Licence), uses some of its test data
