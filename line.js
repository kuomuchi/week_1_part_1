const linebot = require('linebot')
const express = require('express')

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
