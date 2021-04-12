const num = window.localStorage.getItem('oderNumber')
console.log(num)

if (num === null) {
  console.log('還敢下來啊！')
} else {
  document.getElementById('numberData').textContent = '您的訂單編號：' + num
}
