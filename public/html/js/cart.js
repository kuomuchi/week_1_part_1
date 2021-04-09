console.log('nice')

// 設置好等等 GetPrime 所需要的金鑰
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')

// 把 TapPay 內建輸入卡號的表單給植入到 div 中
TPDirect.card.setup('#cardviewContainer')

const submitButton = document.querySelector('#submit-button')

// 設定購物車的icon數量
const carNumber = JSON.parse(localStorage.getItem('car'))
if (carNumber == null) {
  document.getElementById('count').textContent = 0
} else {
  document.getElementById('count').textContent = carNumber.length
}
