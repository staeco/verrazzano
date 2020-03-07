import JSONStream from 'jsonstream-next'

export default () =>
  JSONStream.stringify(
    '{"type":"FeatureCollection","features":[',
    ',',
    ']}'
  )
