require('dotenv').config() // env

const express = require('express')
const path = require('path')
const app = express()
const socketio = require('socket.io')

const http = require('http')

const server = http.createServer(app)
const io = socketio(server, { cors: { origin: '*' } })
const bodyParser = require('body-parser') // 處理post出來的body，讓req.body可以跑出資料。

app.use('/admin', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

server.listen(3000, () => {
  console.log('start math game')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/mathLobby.html'))
})

app.get('/lobby1', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/startMath.html'))
})

// 簡報的部分
let powerPointUrl = ''

app.get('/briefing', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/PowerPoint/sendBriefing.html'))
})

app.get('/startBriefing', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/PowerPoint/startBriefing.html'))
})

app.get('/msgBriefing', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/PowerPoint/sendMsgBriefing.html'))
})

app.get('/boom', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/boomGame.html'))
})

// 開始socket.io連線
let playnum = 0
const playLobby = []
const topic = []
let boomplayer = 0

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.emit('newPlayer', playnum)
  playnum++
  // 斷線的時候:D
  socket.on('startGame', (msg) => {
    if (playLobby.length < 2) {
      playLobby.push(msg)
      console.log('玩家進入')

      // 當房間滿了，等待一下再開始遊戲。
    } else {
      console.log('遊戲大廳已滿')
      socket.emit('lobbyFull', 'stop')
    }

    if (playLobby.length === 2) {
      console.log('loading...')
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          const quatity = Math.floor(Math.random() * 2) + 2 + i / 2
          topic[i] = []
          for (let u = 0; u < quatity; u++) {
            const number = Math.floor(Math.random() * (30 * (i + 1))) + 1
            topic[i].push([number])
          }
        }
        playLobby.push(topic)
        setTimeout(() => {
          socket.broadcast.emit('newGame', playLobby)
        }, 2000)
      }, 1500)
    }
  })

  socket.on('postMsg', (msg) => {
    socket.broadcast.emit('postMsg', msg)
  })

  //
  // 簡報的部分
  socket.on('postPowerPoint', (msg) => {
    powerPointUrl = msg
    console.log(powerPointUrl)
  })

  socket.on('getPowerPoint', () => {
    console.log('someone get ppt')
    setTimeout(() => {
      socket.emit('sendppt', powerPointUrl)
      console.log('send it')
    }, 500)
  })

  socket.on('snedmsg', (msg) => {
    console.log('sendMsgtoWeb')
    socket.broadcast.emit('sendIt', msg)
  })

  //
  // boomGame的部分
  socket.on('boomAdd', () => {
    boomplayer++
    socket.emit('createId', boomplayer)
  })
})
