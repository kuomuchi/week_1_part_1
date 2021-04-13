console.log('jeff')

// 遊戲初始化
const player = window.localStorage.getItem('player')
console.log(player)

if (player === null) {
  window.location.href = 'http://localhost:3000/figthing'
  alert('尚未報名..')
} else if (+player === 1) {
  console.log('player_1_login')
  let str = ''
  // while (str.data !== 'notYet') {
  setTimeout(() => {
    console.log('start Loding....')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:3000/mathstart', true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        str = xhr.responseText
        str = JSON.parse(str)
        console.log(str)
        if (str.data === 'notYet') {
          console.log('notyet')
        } else {
          if (+player === 1) {
            document.getElementById('name').textContent = str.data.player2
          } else if (+player === 2) {
            document.getElementById('name').textContent = str.data.player1
          }
        }
      }
    }

    let data = { data: +player }
    data = JSON.stringify(data)
    xhr.send(data)
  }, 1000)
  // }
} else if (+player === 2) {
  console.log('plauer_2_login')
}

document.getElementById('summit').addEventListener('click', () => {
  console.log('click')
})

// 玩家準備
document.getElementById('ready').addEventListener('click', (event) => {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost:3000/mathstart', true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let str = ''
      str = xhr.responseText
      str = JSON.parse(str)
      if (str.data === 'notYet') {
        console.log('notyet')
      } else {
        if (+player === 1) {
          document.getElementById('name').textContent = str.data.player2
        } else if (+player === 2) {
          document.getElementById('name').textContent = str.data.player1
        }
      }
    }
  }
  let data = { data: +player }
  data = JSON.stringify(data)
  xhr.send(data)
})
