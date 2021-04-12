console.log('成功進入購物車')
document.querySelectorAll('div.value > span')[0].textContent = 0
document.querySelectorAll('div.value > span')[1].textContent = 0

const trollThing = localStorage.getItem('troll')
if (+trollThing === 5) {
  document.getElementById('ImBad').style.display = 'block'
}

const getCatLength = JSON.parse(localStorage.getItem('car'))
document.getElementById('itemTitle').textContent = '購物車(' + getCatLength.length + ')'

// 設定購物車的icon數量
const carNumber = JSON.parse(localStorage.getItem('car'))
if (carNumber == null) {
  document.getElementById('count').textContent = 0
} else {
  document.getElementById('count').textContent = carNumber.length
}

const totalPay = []
totalPay[0] = 0

for (let i = 0; i < carNumber.length; i++) {
  // create product Item
  let outElement = document.getElementById('items')
  let newItem = document.createElement('div')
  newItem.classList.add('item')

  // newItem.addEventListener('click', () => {
  //   console.log('set' + i)
  // })

  // 如果不是第一個Item，之後的product都要離top 30px
  if (i !== 0) {
    newItem.style.marginTop = '30px'
  }
  outElement.appendChild(newItem)

  // Create Item-image
  outElement = document.getElementsByClassName('item')[i]
  newItem = document.createElement('img')
  newItem.classList.add('itemImage')
  newItem.src = `${carNumber[i].images}`

  outElement.appendChild(newItem)

  // 設定Item的文字介紹，以及說明
  outElement = document.getElementsByClassName('item')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemDetail')

  outElement.appendChild(newItem)

  // 設置Item的說明細項
  // Item名字
  outElement = document.getElementsByClassName('itemDetail')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemName')

  newItem.textContent = `${carNumber[i].name}`
  outElement.appendChild(newItem)

  // Item ID
  outElement = document.getElementsByClassName('itemDetail')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemId')

  newItem.textContent = `${carNumber[i].id}`
  outElement.appendChild(newItem)

  // Item color
  outElement = document.getElementsByClassName('itemDetail')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemColor')

  newItem.textContent = `顏色｜${carNumber[i].color}`
  outElement.appendChild(newItem)

  // Item size
  outElement = document.getElementsByClassName('itemDetail')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemSize')

  newItem.style.marginTop = '9px'
  newItem.textContent = `尺寸｜${carNumber[i].size}`
  outElement.appendChild(newItem)

  // Item stock
  outElement = document.getElementsByClassName('item')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemQ')
  outElement.appendChild(newItem)

  // add stock buttom
  outElement = document.getElementsByClassName('itemQ')[i]
  newItem = document.createElement('div')
  newItem.textContent = `${carNumber[i].stock}`

  // 當數量被點擊
  newItem.addEventListener('click', () => {
    const gN = localStorage.getItem('troll')
    if (gN === null) {
      alert('點我幹嘛？')
      localStorage.setItem('troll', 1)
    } else if (+gN === 1) {
      alert('母湯喔！\n這裡有特殊的設定！')
      localStorage.setItem('troll', 2)
    } else if (+gN === 2) {
      alert('警告過你了！！不要再按了喔！')
      localStorage.setItem('troll', 3)
    } else if (+gN === 3) {
      alert('在按下去會有不可逆的後果啊！\n這個功能我真的有做！')
      localStorage.setItem('troll', 4)
    } else if (+gN === 4) {
      alert('最終警告！\n若是在按下去...我會..')
      localStorage.setItem('troll', 5)
    } else if (+gN === 5) {
      document.getElementById('ImBad').style.display = 'block'
    }
  })
  outElement.appendChild(newItem)

  // add price
  outElement = document.getElementsByClassName('item')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemPr')
  newItem.textContent = `NT.${carNumber[i].price}`
  outElement.appendChild(newItem)

  // add total proice
  outElement = document.getElementsByClassName('item')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemSu')
  totalPay[0] += carNumber[i].stock * carNumber[i].price
  newItem.textContent = `NT.${carNumber[i].stock * carNumber[i].price}`
  outElement.appendChild(newItem)

  // add remove buttom
  outElement = document.getElementsByClassName('item')[i]
  newItem = document.createElement('div')
  newItem.classList.add('itemRe')
  outElement.appendChild(newItem)

  // add remove buttom icon
  outElement = document.getElementsByClassName('item')[i]
  newItem = document.createElement('img')
  newItem.classList.add('removeIcon')

  // create remove buttom action
  newItem.addEventListener('click', (event) => {
    console.log(event)

    // 使用超級神奇的方法，獲取localStorage的資料。
    const splColor = event.path[1].children[1].children[2].innerText.split('顏色｜')
    const splSize = event.path[1].children[1].children[3].innerText.split('尺寸｜')
    const getProductData = {
      name: event.path[1].children[1].children[0].innerText,
      id: event.path[1].children[1].children[1].innerText,
      color: splColor[1],
      size: splSize[1]
    }

    // console.log(event.path[1].children[3].innerHTML)
    const splitTotal = event.path[1].children[4].innerHTML.split('NT.')

    const youCar = JSON.parse(localStorage.getItem('car'))

    if (youCar.length === 1) {
      // 如果LocalStorage只有 1 ，就直接刪除。
      totalPay[0] = 0
      window.localStorage.removeItem('car')
      document.getElementById('itemTitle').textContent = '購物車(0)'
    } else {
      // 計算總金額
      totalPay[0] -= +splitTotal[1]

      // 把local的資料拆開
      const allProduct = []

      for (let i = 0; i < youCar.length; i++) {
        // 將重複的product整理成同個LocalStorage

        // 確認要刪除的項目
        if (getProductData.color === youCar[i].color && getProductData.size === youCar[i].size && +getProductData.id === youCar[i].id) {
          console.log('查詢相同的item')
        } else {
          allProduct.push(youCar[i])
        }
      }

      // 將剩餘資料丟入 LocalStorage
      window.localStorage.setItem('car', JSON.stringify(allProduct))
      const newLenght = JSON.parse(localStorage.getItem('car'))
      console.log(typeof (newLenght.length))
      document.getElementById('itemTitle').textContent = '購物車(' + (newLenght.length) + ')'
    }

    // 修改title購物車的數量
    const carNumber = document.getElementById('count').textContent
    document.getElementById('count').textContent = +carNumber - 1
    console.log(carNumber)

    // 刪除正式Child
    event.path[2].removeChild(event.path[1])

    // 修改總金額
    document.querySelectorAll('div.value > span')[0].textContent = totalPay[0]
    document.querySelectorAll('div.value > span')[1].textContent = totalPay[0]
  })
  newItem.src = '/admin/html/images/cart-remove.png'

  outElement.appendChild(newItem)
}

document.querySelectorAll('div.value > span')[0].textContent = totalPay[0]
document.querySelectorAll('div.value > span')[1].textContent = totalPay[0]

// 設置好等等 GetPrime 所需要的金鑰
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')

// 把 TapPay 內建輸入卡號的表單給植入到 div 中
TPDirect.card.setup('#cardviewContainer')

document.getElementById('checkout').addEventListener('click', () => {
  if (localStorage.getItem('access_token') === null) {
    alert('還敢不登入啊！\n想買衣服給我登入喔！')
  } else if (localStorage.getItem('car') === null) {
    alert('你這小壞壞！要買東西才能付錢喔:D')
  } else {
    let prime
    const getUserData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      product: JSON.parse(localStorage.getItem('car')),
      prime: ''
    }

    if (getUserData.name === '' || getUserData.email === '' || getUserData.phone === '' || getUserData.address === '') {
      return alert('請完整填寫訂購資料')
    }

    console.log(getUserData)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://3.13.254.132/cart.html', true)
    xhr.setRequestHeader('Content-type', 'application/json')

    TPDirect.card.getPrime(function (result) {
      if (result.status !== 0) {
        console.log('getPrime 錯誤')
        return
      }

      prime = result.card.prime
      alert('getPrime 成功: ' + prime)
      getUserData.prime = prime
      const printfOut = JSON.stringify(getUserData) // 問題4你!
      document.getElementById('name').value = ''
      document.getElementById('email').value = ''
      document.getElementById('phone').value = ''
      document.getElementById('address').value = ''
      localStorage.removeItem('car')
      document.getElementById('count').textContent = 0
      document.querySelectorAll('div.value > span')[0].textContent = 0
      document.querySelectorAll('div.value > span')[1].textContent = 0

      // remove all items child
      const removeAllChild = document.getElementById('items')
      while (removeAllChild.firstChild) {
        removeAllChild.removeChild(removeAllChild.firstChild)
      }

      xhr.send(printfOut)
    })

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let str = ''
        str = xhr.responseText
        str = JSON.parse(str)
        console.log(str)
        if (str.status !== undefined) {
          alert('操作失誤，請聯繫我:D')
        } else {
          localStorage.setItem('oderNumber', str.data)
          alert('你的訂單編號為：' + str.data)
          window.location.href = 'http://3.13.254.132/thankyou.html'
        }
      }
    }
  }
})
