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

setTimeout(function () {
  bot.push('U813645541c262fb6d9c967efeb884aeb', '啟動了！')
}, 0)

app.listen(3001, () => {
  console.log('LineBot is running.')
})

bot.on('follow', function (event) {
  event.reply('你好！謝謝你加我好友 :D')
  bot.push(me, '有人加我好友耶！\n我的朋友有一天會比你多的 >:D')
})

bot.on('join', function (event) {
  event.reply('嗨')
  bot.push('U813645541c262fb6d9c967efeb884aeb', '有人加我到群組裡耶 :)')
})
