import Vue from 'vue'
import axios from 'axios'

class Image {
  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3009/',
    })
  }

  get(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
           .then((response) => {
             return resolve(response)
           })
           .catch((error) => {
             return reject(error)
           })
    })
  }
}

let imageModel = {
  id: null,
  product_id: null
}

export default Image
