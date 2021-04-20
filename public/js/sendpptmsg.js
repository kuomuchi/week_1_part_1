const socket = io('https://woyaozousini.site')

console.log('sendIt')

document.getElementById('summit').addEventListener('click', () => {
  if (document.getElementById('input').value === '') {
    alert('還敢傳空白訊息啊！')
  } else {
    const sendMsg = document.getElementById('input').value
    socket.emit('snedmsg', sendMsg)
    document.getElementById('input').value = ''
  }
})
