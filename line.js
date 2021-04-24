const linebot = require('linebot')
const express = require('express')

const crypto = require('crypto')

const channelSecret = '...' // Channel secret string
const body = '...' // Request body string
const signature = crypto
  .createHmac('SHA256', channelSecret)
  .update(body).digest('base64')
// Compare x-line-signature request header and the signature

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const app = express()

const linebotParser = bot.parser()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/hook', (req, res) => {
  console.log(req.body) // Call your action on the request here
  res.status(200).end() // Responding is important
})

bot.on('message', function (event) {
  if (event.message.text) {
    event.reply('yaaa').then(function (data) {
      console.log('Success', data)
    }).catch(function (error) {
      console.log('Error', error)
    })
  }
})

setTimeout(function () {
  bot.push('U813645541c262fb6d9c967efeb884aeb', '啟動了！')
}, 0)

bot.listen('/hook', 3001, function () {
  console.log('[BOT已準備就緒]')
})

bot.on('join', function (event) {
  event.reply('嗨')
  bot.push('U813645541c262fb6d9c967efeb884aeb', '有人加我到群組裡耶 :)')
})
