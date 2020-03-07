import JSONStream from 'jsonstream-next'

export default () =>
  JSONStream.parse('features.*')
