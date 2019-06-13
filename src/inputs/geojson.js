import JSONStream from 'JSONStream'

export default () =>
  JSONStream.parse('features.*')
