const socket = io('https://woyaozousini.site')
const player = window.localStorage.getItem('player')
let nowTopic = -1
let ans
let playerPoint = 0

// 遊戲開始
socket.on('newGame', (msg) => {
  console.log('start!')
  document.getElementsByClassName('ui')[0].style.opacity = 1
  document.getElementsByClassName('ui')[1].style.opacity = 1
  for (let i = 0; i < 2; i++) {
    // 確認敵方玩家名稱
    if (msg[i].id !== +player) {
      document.getElementById('name').textContent = msg[i].name
      document.getElementById('game').style.backgroundColor = '#ccc'
    }
  }
  ans = msg[2]

  nowTopic++

  // 準備第一題

  let anstext = ''
  for (let i = 0; i < ans[nowTopic].length; i++) {
    anstext += '' + ans[nowTopic][i][0]
    if (i !== ans[nowTopic].length - 1) {
      anstext += ' + '
    }
  }
  document.getElementById('topic').textContent = anstext
})

// 玩家點擊回答按鈕
document.getElementById('summit').addEventListener('click', (req, res) => {
  let totalAns = 0
  const playAns = +document.getElementById('ansValue').value
  const playerMsg = document.getElementById('ansValue').value
  document.getElementById('ansValue').value = ''

  // 計算答案
  for (let i = 0; i < ans[nowTopic].length; i++) {
    totalAns += ans[nowTopic][i][0]
  }

  if (playAns === totalAns) {
    playerPoint++
    textTopic()
    console.log('目前分數：' + playerPoint)
  }

  if (nowTopic === 9) {
    document.getElementById('topic').textContent = '結束！'
    if (playerPoint > 5) {
      alert('你贏了！！')
    } else if (playerPoint > 5) {
      alert('平手喔:D')
    } else {
      alert('嫩')
    }
  }

  // 回傳玩家的答案
  const requests = {
    id: +player,
    ans: playerMsg,
    reply: (playAns === totalAns),
    ending: (nowTopic === 9)
  }

  socket.emit('postMsg', requests)
  console.log(requests)
})

socket.on('postMsg', (msg) => {
  if (msg.ending === true) {
    document.getElementById('topic').textContent = '結束！'
    if (playerPoint > 5) {
      alert('你贏了！！')
    } else if (playerPoint > 5) {
      alert('平手喔:D')
    } else {
      alert('嫩')
    }
  } else {
    if (msg.id !== +player) {
      document.getElementById('math').textContent = msg.ans
    }
    console.log('here')
    console.log(msg)
    console.log(msg.reply)
    if (msg.reply === true) {
      textTopic()
    }
  }
})

function textTopic () {
  nowTopic++
  let anstext = ''
  for (let i = 0; i < ans[nowTopic].length; i++) {
    anstext += '' + ans[nowTopic][i][0]
    if (i !== ans[nowTopic].length - 1) {
      anstext += ' + '
    }
  }
  document.getElementById('topic').textContent = anstext
}
