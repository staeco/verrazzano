<p align='center'>
  <img src='https://user-images.githubusercontent.com/425716/56301002-f33aef00-6104-11e9-828c-b7351d7c9b87.png' width='400'/>
  <p align='center'>Streaming geospatial format conversion - SHP/GDB/KML/etc. <-> GeoJSON</p>
</p>

# mauro [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]


## Install

```
npm install mauro --save
```

## Limitations

This module was designed for conversion between a multitude of vector formats and GeoJSON. If you need to convert between any of these formats (SHP -> KML, GDB -> SHP, etc.) you can technically use this module, albeit in a very roundabout and inefficient way (via piping a `from()` to a `to()`).

Because most geospatial formats are zip-based structures it is not possible to operate on these in a streaming/memory efficient way (the manifest for a zip is stored at the end of the file). In these cases, a temporary file will be used for the duration of the stream.

## Supported Formats

### Parsing

- SHP
- GDB
- GPX
- KML

### Creation

- SHP
- GPX
- KML

## Example

```js
import fs from 'graceful-fs'
import mauro from 'mauro'

// SHP -> GeoJSON FeatureCollection
fs.createReadStream('zones.shp')
  .pipe(mauro.from('shp'))
  .pipe(fs.createWriteStream('zones.geojson'))

// SHP -> GeoJSON Features
fs.createReadStream('zones.shp')
  .pipe(mauro.from('shp'))
  .pipe(JSONStream.parse('features.*'))
  .pipe(through2.obj((feat, _, cb) => {
    // Do whatever you want with it here!
    cb(null, feat)
  }))

// GeoJSON FeatureCollection -> SHP
fs.createReadStream('zones.geojson')
  .pipe(mauro.to('shp'))
  .pipe(fs.createWriteStream('zones.shp'))

// SHP -> KML
fs.createReadStream('zones.shp')
  .pipe(mauro.from('shp'))
  .pipe(mauro.to('kml'))
  .pipe(fs.createWriteStream('zones.kml'))
```

[downloads-image]: http://img.shields.io/npm/dm/mauro.svg
[npm-url]: https://npmjs.org/package/mauro
[npm-image]: http://img.shields.io/npm/v/mauro.svg

[travis-url]: https://travis-ci.org/staeco/mauro
[travis-image]: https://travis-ci.org/staeco/mauro.png?branch=master
