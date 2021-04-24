require('dotenv').config() // 隱藏檔案.env
const linebot = require('linebot')
const express = require('express')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_SECRET
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
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  event.reply(event.message.text).then(function (data) {
    console.log(data)
  }).catch(err => {
    console.log(err)
  })
})

setTimeout(function () {
  bot.push('U813645541c262fb6d9c967efeb884aeb', '啟動了！')
}, 0)

bot.listen(3001, function () {
  console.log('[BOT已準備就緒]')
})

bot.on('join', function (event) {
  event.reply('嗨')
  bot.push('U813645541c262fb6d9c967efeb884aeb', '有人加我到群組裡耶 :)')
})
