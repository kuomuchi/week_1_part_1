const socket = io('https://woyaozousini.site')

// 新增玩家ID
window.localStorage.removeItem('boom')
socket.emit('boomAdd')
let responeX = Math.floor(Math.random() * 460)
let responeY = Math.floor(Math.random() * 460)
let sendPlayerId = ''
const enemyMap = []
let isLife = 1

if (isLife === 1) {
  socket.on('createId', (msg) => {
  // 如果玩家沒有Id 則給玩家一個Id

    if (window.localStorage.getItem('boom') === null) {
      window.localStorage.setItem('boom', msg.id)

      const playerId = window.localStorage.getItem('boom')
      // 創建玩家人物 div
      const outElement = document.getElementById('gameBox')
      const newChild = document.createElement('div')
      newChild.id = 'id' + playerId
      sendPlayerId = 'id' + playerId
      newChild.classList.add('player')
      outElement.appendChild(newChild)
      document.getElementById('id' + playerId).style.top = responeX
      document.getElementById('id' + playerId).style.left = responeY
      playerStart('id' + playerId)
      uploadMap(msg.position, sendPlayerId)
    } else {
    // 如果有其他玩家登入，看看他們的位置 :D
      uploadMap(msg.position, sendPlayerId)
    }
  })

  // 收到其他人的位置
  socket.on('Updata', (msg) => {
    if (window.localStorage.getItem('boom') !== null) {
      const playerId = 'id' + window.localStorage.getItem('boom')
      uploadMap(msg, playerId)
    }
  })

  // 放置炸彈
  socket.on('putBoom', (msg) => {
    if (window.localStorage.getItem('boom') !== null) {
      dropBoom(msg.X, msg.Y)
    }
  })

  // 當有人掛掉
  socket.on('userDie', (msg) => {
    if (window.localStorage.getItem('boom') !== null) {
      userGg(msg)
    }
  })
}

// 顯示其他玩家的位置
// 1.生成敵人
// 2.移動敵人
function uploadMap (boxSite, playerId) {
  for (let i = 0; i < boxSite.length; i++) {
    let isEnemyOnMap = 0

    // 如果map的物件id不等於玩家
    if (boxSite[i].id !== playerId) {
      // 確認敵人的物件，是否有存在場上。
      for (u = 0; u < enemyMap.length; u++) {
        // 如果敵人有存在
        if (enemyMap[u] === boxSite[i].id) {
          isEnemyOnMap = 1
          break
        }
      }

      // 如果是新的敵人，創建一個新的物件給他 :D
      if (isEnemyOnMap === 0) {
        enemyMap.push(boxSite[i].id)
        const outElement = document.getElementById('gameBox')
        const newEnemy = document.createElement('div')
        newEnemy.classList.add('enemy')
        newEnemy.id = boxSite[i].id
        // 成功創建新的敵人
        outElement.appendChild(newEnemy)
      }

      // 設定敵人的位置
      document.getElementById(boxSite[i].id).style.top = boxSite[i].Y
      document.getElementById(boxSite[i].id).style.left = boxSite[i].X
    }
  }
}

// 設置玩玩家的移動
function playerStart (PlayerId) {
  const player = document.getElementById(PlayerId)
  player.style.top = responeY
  player.style.left = responeX
  socket.emit('boomPlayUpdata', { id: PlayerId, X: responeX, Y: responeY })

  window.addEventListener('keydown', (event) => {
    if (isLife === 1) {
      console.log(isLife)
      if (event.code === 'KeyA') {
        if (responeX >= 20) {
          responeX -= 10
          player.style.left = responeX
          socket.emit('boomPlayUpdata', { id: PlayerId, X: responeX, Y: responeY })
        }
      } else if (event.code === 'KeyD') {
        if (responeX <= 480) {
          responeX += 10
          player.style.left = responeX
        }
        socket.emit('boomPlayUpdata', { id: PlayerId, X: responeX, Y: responeY })
      }

      if (event.code === 'KeyW') {
        if (responeY >= 20) {
          responeY -= 10
          player.style.top = responeY
        }
        socket.emit('boomPlayUpdata', { id: PlayerId, X: responeX, Y: responeY })
      } else if (event.code === 'KeyS') {
        if (responeY <= 480) {
          responeY += 10
          player.style.top = responeY
        }
        socket.emit('boomPlayUpdata', { id: PlayerId, X: responeX, Y: responeY })
      }

      // 釋放炸彈
      if (event.code === 'Space') {
        dropBoom(responeX, responeY)
        socket.emit('putBoom', { X: responeX, Y: responeY })
      }
    }
  }, false)
}

// 放置炸彈 :D
function dropBoom (x, y) {
  const createElement = document.getElementById('gameBox')
  const aBoom = document.createElement('div')
  aBoom.classList.add('boom')
  aBoom.style.top = y
  aBoom.style.left = x
  setTimeout(() => {
    // 判斷是否有把人幹死 :D
    if (responeY < (y + 60) && responeY > (y - 60) && responeX < (x + 60) && responeX > (x - 60)) {
      console.log('die')
      isLife = 0
      userGg(sendPlayerId)
      socket.emit('userDie', sendPlayerId)
    }

    aBoom.style.width = '80px'
    aBoom.style.height = '80px'
    setTimeout(() => {
      createElement.removeChild(aBoom)
    }, 500)
  }, 3000)
  createElement.appendChild(aBoom)
}

// 處理掛掉的人
function userGg (id) {
  const outElement = document.getElementById('gameBox')
  const dieUser = document.getElementById(id)
  outElement.removeChild(dieUser)
  for (let i = 0; i < enemyMap.length; i++) {
    if (enemyMap[i] === id) {
      enemyMap[i] = 'die'
    }
  }
}
