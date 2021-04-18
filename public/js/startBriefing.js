const socket = io('http://3.13.254.132')

socket.emit('getPowerPoint')

console.log('test')
socket.on('sendppt', (msg) => {
  document.getElementById('ppt').src = msg
  console.log(msg)
})

socket.on('sendIt', (msg) => {
  const colorR = Math.floor(Math.random() * 255)
  const colorG = Math.floor(Math.random() * 255)
  const colorB = Math.floor(Math.random() * 255)
  const randomTop = Math.floor(Math.random() * 750) + 15
  const outElement = document.getElementById('body')
  const newChild = document.createElement('div')
  newChild.textContent = msg
  newChild.style.color = `rgb(${colorR}, ${colorG}, ${colorB})`
  newChild.style.top = randomTop
  newChild.classList.add('move')
  newChild.style.zIndex = 99

  // 限制Child的出現時間
  setTimeout(() => {
    // 時間到就直接被消失
    outElement.removeChild(newChild)
  }, 5000)

  // 延遲大招:D
  outElement.appendChild(newChild)

  console.log(msg)
})
