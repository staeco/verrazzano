<p align='center'>
  <img src='https://user-images.githubusercontent.com/425716/56301002-f33aef00-6104-11e9-828c-b7351d7c9b87.png' width='400'/>
  <p align='center'>Streaming geospatial format conversion</p>
</p>

# verrazzano [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]


## Install

```
npm install verrazzano --save
```

## Supported Formats

### Parsing

- SHP
- GDB
- GPX
- KML
- KMZ
- GeoJSON

### Creation

- SHP
- GPX (Partial)
- KML
- KMZ
- GeoJSON

## API

### from(format)

Returns a stream. Input is the file content. Output is GeoJSON Feature objects.

### to(format)

Returns a stream. Input is GeoJSON Feature objects. Output is the file content.

## Example

```js
import fs from 'graceful-fs'
import geo from 'verrazzano'

// SHP -> GeoJSON Feature objects
fs.createReadStream('zones.shp')
  .pipe(geo.from('shp'))
  .pipe(through2.obj((feat, _, cb) => {
    // Do whatever you want with it here!
    cb(null, feat)
  }))

// SHP -> GeoJSON FeatureCollection
fs.createReadStream('zones.shp')
  .pipe(geo.from('shp'))
  .pipe(geo.to('geojson'))
  .pipe(fs.createWriteStream('zones.geojson'))

// GeoJSON FeatureCollection -> SHP
fs.createReadStream('zones.geojson')
  .pipe(geo.from('geojson'))
  .pipe(geo.to('shp'))
  .pipe(fs.createWriteStream('zones.shp'))

// SHP -> KML
fs.createReadStream('zones.shp')
  .pipe(geo.from('shp'))
  .pipe(geo.to('kml'))
  .pipe(fs.createWriteStream('zones.kml'))
```

## Limitations

- For zip-based geospatial formats it is not possible to operate on these in a streaming/memory efficient way (the manifest for a zip is stored at the end of the file). In these cases, a temporary file will be used for the duration of the stream.
- In some cases where GDAL needs to be used, a temporary file will be used. Over time we will replace GDAL with pure JS parsers.


[downloads-image]: http://img.shields.io/npm/dm/verrazzano.svg
[npm-url]: https://npmjs.org/package/verrazzano
[npm-image]: http://img.shields.io/npm/v/verrazzano.svg

[travis-url]: https://travis-ci.org/staeco/verrazzano
[travis-image]: https://travis-ci.org/staeco/verrazzano.png?branch=master
