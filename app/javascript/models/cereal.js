import _ from 'lodash'

export default class Cereal {
  constructor(json) {
    let parsed = JSON.parse(json)
    this.object = {}
    for (let key in parsed) {
      this.object[_.camelCase(key)] = parsed[key]
    }
  }
}

/*
class Image extends Cereal {
  constructor(json) {
    super
  }
}*/

