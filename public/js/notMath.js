
document.getElementById('button').addEventListener('click', () => {
  const catchStorage = window.localStorage.getItem('player')
  if (catchStorage === null) {
    const username = document.getElementById('nameValue').value
    console.log(username)
    if (username !== '') {
      const data = {
        data: 1,
        name: document.getElementById('nameValue').value
      }

      const newPlayer = JSON.stringify(data)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'http://localhost:3000/figthing', true)
      xhr.setRequestHeader('Content-type', 'application/json')
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let str = ''
          str = xhr.responseText
          str = JSON.parse(str)
          console.log(str)

          if (str.data === '人數滿了') {
            alert('玩家人數已滿')
          } else {
            alert('你好' + data.name + '歡迎加入:D')

            window.localStorage.setItem('player', '' + str.data.status)
            window.location.href = 'http://localhost:3000/mathstart'
          }

          console.log(str)
        }
      }
      xhr.send(newPlayer)
    } else {
      alert('請輸入名稱')
    }
  } else {
    alert('你已加入了遊戲')
  }
})
