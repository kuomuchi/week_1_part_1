const socket = io('http://3.13.254.132')

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
