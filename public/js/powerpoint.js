const socket = io('https://woyaozousini.site')

document.getElementById('summit').addEventListener('click', () => {
  if (document.getElementById('input').value === '') {
    alert('請別填空')
  } else {
    alert('已將連結送出')
    const inputValue = document.getElementById('input').value
    socket.emit('postPowerPoint', inputValue)
    document.getElementById('input').value = ''
  }
})
