const socket = io('localhost:3000')

// 新增玩家ID
window.localStorage.removeItem('boom')
socket.emit('boomAdd')

socket.on('createId', (msg) => {
  // 如果玩家沒有Id 則給玩家一個Id
  if (window.localStorage.getItem('boom') === null) {
    window.localStorage.setItem('boom', msg)

    const playerId = window.localStorage.getItem('boom')
    // 創建玩家人物 div
    const outElement = document.getElementById('gameBox')
    const newChild = document.createElement('div')
    newChild.id = 'id' + playerId
    newChild.classList.add('player')
    outElement.appendChild(newChild)
    document.getElementById('id' + playerId).style.top = Math.floor(Math.random() * 460)
    document.getElementById('id' + playerId).style.left = Math.floor(Math.random() * 460)
  }
})

// 設置玩玩家的移動
// const player = document.getElementById('player')
// let playerX = 250
// let playerY = 250
// player.style.top = 250
// player.style.left = 250

// window.addEventListener('keydown', (event) => {
//   if (event.code === 'KeyA') {
//     if (playerX >= 10) {
//       playerX -= 10
//       player.style.left = playerX
//     }
//   } else if (event.code === 'KeyD') {
//     if (playerX <= 460) {
//       playerX += 10
//       player.style.left = playerX
//     }
//   }

//   if (event.code === 'KeyW') {
//     if (playerY >= 10) {
//       playerY -= 10
//       player.style.top = playerY
//     }
//   } else if (event.code === 'KeyS') {
//     if (playerY <= 460) {
//       playerY += 10
//       player.style.top = playerY
//     }
//   }
// }, false)
