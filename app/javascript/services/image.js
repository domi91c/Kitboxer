import Vue from 'vue'
import axios from 'axios'

class Image {
  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3003/',
    })
    this.object = {
      _id: 0,
    }
  }

  get(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
           .then((response) => {
             debugger
             return resolve(response)
           })
           .catch((error) => {
             return reject(error)
           })
    })
  }
}

export default Image
