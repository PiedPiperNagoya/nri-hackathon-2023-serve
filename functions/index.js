const {onCall} = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')
const axiosBase = require('axios')
const { Buffer } = require('node:buffer')

const API_KEY = 'AIzaSyAeQ29pFqC9WcI-s8MLk8yUWZGInhu8sHQ'

// 入力内容から候補スポットを取得
exports.getCandidates = onCall(
  async (req,) => {
    logger.info(`req.data.text : ${req.data.text}`, {structuredData: true})

    const baseUrl = 'https://places.googleapis.com/v1'

    const axios = axiosBase.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places',
      },
      responseType: 'json'
    })

    const res = await axios.post('/places:searchText', {
      textQuery: req.data.text,
      languageCode: 'ja',
      locationBias: {
        circle: {
          center: {
            latitude: req.data.lat,
            longitude: req.data.lng,
          },
          radius: 50000,
        },
      },
    })

    logger.info(res.data, {structuredData: true})

    return {
      data: res.data,
    }
  })


// 写真のURLを取得
exports.getPhotoUrl = onCall(
  async (req,) => {

    const baseUrl = 'https://places.googleapis.com/v1'

    const axios = axiosBase.create({
      baseURL: baseUrl,
    })

    const res = await axios.get(`/${req.data.name}/media?key=${API_KEY}&maxHeightPx=400`)
    logger.info(`https://places.googleapis.com/v1/${req.data.name}/media?key=${API_KEY}&maxHeightPx=100`, {structuredData: true})

    return {
      binary: res.data,
    }
  }
)
