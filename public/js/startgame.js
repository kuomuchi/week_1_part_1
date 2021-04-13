console.log('jeff')

const player = window.localStorage.getItem('player')
console.log(player)

if (+player === 1) {
  console.log('login')
}

document.getElementById('summit').addEventListener('click', () => {
  console.log('click')
})
