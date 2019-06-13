import JSONStream from 'JSONStream'

export default () =>
  JSONStream.stringify(
    '{"type":"FeatureCollection","features":[',
    ',',
    ']}'
  )
