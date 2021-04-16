const socket = io('http://3.13.254.132:3000')
let lobbyFull = 0
let playerId = -1

const data = {
  id: -1,
  name: ''
}

if (playerId === -1) {
  socket.on('newPlayer', (id) => {
    console.log(id)
    playerId = id
    data.id = id
  })
}

socket.on('lobbyFull', () => {
  lobbyFull = 1
})

document.getElementById('button').addEventListener('click', () => {
  const catchStorage = window.localStorage.getItem('player')
  if (catchStorage === null) {
    const username = document.getElementById('nameValue').value
    if (username !== '') {
      // 設定玩家名字
      if (lobbyFull === 0) {
        console.log(lobbyFull)
        data.name = username
        socket.emit('startGame', data)

        // 稍作等待，並且帶入。
        setTimeout(() => {
          if (lobbyFull === 0) {
            alert('成功加入遊戲！')
            window.location.href = 'http://3.13.254.132:3000/lobby1'
            window.localStorage.setItem('player', data.id)
          } else {
            alert('已滿')
          }
        }, 200)
      } else {
        alert('遊戲大廳已滿')
      }
    } else {
      alert('請輸入名稱')
    }
  } else {
    alert('你已加入了遊戲')
  }
})
