# SHP.ts 🗺️

TypeScript package for loading Esri Shapefiles, primary developed for for WebGL applications

-   ✅ returns a geojson-like representation
-   ✅ supports all shape types (including MultiPatch) per [Esri Shapefile specification](https://www.esri.com/content/dam/esrisites/sitecore-archive/Files/Pdfs/library/whitepapers/pdfs/shapefile.pdf)
-   ✅ supports X, Y, Z, and M coordinates
-   ✅ uses vitest 🧪 for testing
-   ✅ includes mapbox's earcut triangulation

## Install from [npm](https://www.npmjs.com/package/shpts)

```
npm install shpts
```

| Branch  |                                                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Release | [![SHPts CI Release](https://github.com/vojtatom/shpts/actions/workflows/ci.yaml/badge.svg?branch=release)](https://github.com/vojtatom/shpts/actions/workflows/ci.yaml) |
| Dev     | [![SHPts CI Dev](https://github.com/vojtatom/shpts/actions/workflows/ci.yaml/badge.svg?branch=dev)](https://github.com/vojtatom/shpts/actions/workflows/ci.yaml)         |

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

triangulate a polygon (expects a set of rings, where the first one is the outer ring and the rest are holes):

```typescript
import { triangulate, Ring } from 'shpts';

const input: Ring[] = [
    [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
    ],
];
const output = triangulate(input, CoordType.XY);
//Float32Array([1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1])
```

## Credits

-   insipred by https://github.com/oyvindi/ts-shapefile (MIT Licence), uses all of its test data, partially uses its code
-   inspired by https://github.com/GeospatialPython/pyshp (MIT Licence), uses some of its test data
