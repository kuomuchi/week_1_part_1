console.log('konodioda')

const xhr = new XMLHttpRequest()
const productNowSelect = []
const objVariants = { data: {} }
const objProduct = {}

// 獲得資料，準備新增東西。
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    console.log(productId)
    // 將api的資料引入 data
    const data = xhr.responseText

    // 將data的資料整理成obj
    const objData = JSON.parse(data)

    // 將資料帶出
    objProduct.data = objData.data
    console.log(objProduct)

    // 將data裡面的variants取出
    objVariants.data = objData.data.variants

    // pass data image
    document.getElementById('product_main_image').src = `${objData.data.main_image}`
    document.getElementById('product_title').textContent = `${objData.data.title}`
    document.getElementById('product_id').textContent = `${objData.data.id}`
    document.getElementById('product_price').textContent = `TWD.${objData.data.price}`

    // 查看colors長度以及sizes
    console.log(objData.data.colors.length + ' and ' + objData.data.sizes.length)

    // 放入color按鈕
    for (let i = 0; i < objData.data.colors.length; i++) {
      const outElement = document.getElementById('product_colors')
      const addNewChild = document.createElement('div')
      addNewChild.classList.add('product_color')
      addNewChild.style.backgroundColor = objData.data.colors[i].code

      // 點擊時，出現點擊效果。 這個寫法超怪....但是我喜翻 :D 來看看會不會有人發現:DDDDDDD
      addNewChild.addEventListener('click', () => {
        const productColorLength = document.getElementsByClassName('product_color').length
        for (let u = 0; u < productColorLength; u++) {
          document.getElementsByClassName('product_color')[u].classList.remove('product_color_select')
        }

        // 抓取目前選取的顏色
        const nowColor = addNewChild.style.backgroundColor
        if (nowColor === 'rgb(0, 255, 0)') {
          productNowSelect[0] = '#00ff00'
        } else if (nowColor === 'rgb(255, 0, 0)') {
          productNowSelect[0] = '#ff0000'
        } else if (nowColor === 'rgb(0, 0, 255)') {
          productNowSelect[0] = '#0000ff'
        }
        // 重置數量
        productNowSelect[3] = 1
        document.getElementById('quantity').textContent = 1

        addNewChild.classList.add('product_color_select')
      })
      outElement.appendChild(addNewChild)
    }

    // 創建size按鈕
    for (let i = 0; i < objData.data.sizes.length; i++) {
      const outElement = document.getElementById('product_sizes')
      const addNewChild = document.createElement('div')
      addNewChild.classList.add('product_size')
      addNewChild.textContent = objData.data.sizes[i]

      // 當點擊size按鈕
      addNewChild.addEventListener('click', () => {
        const productColorLength = document.getElementsByClassName('product_size').length
        for (let u = 0; u < productColorLength; u++) {
          document.getElementsByClassName('product_size')[u].classList.remove('product_size_select')
        }

        // 重置數量
        const nowSize = addNewChild.textContent
        productNowSelect[1] = nowSize
        productNowSelect[3] = 1
        document.getElementById('quantity').textContent = 1

        addNewChild.classList.add('product_size_select')
      })

      outElement.appendChild(addNewChild)
    }

    // note
    document.getElementById('product_note').textContent = `${objData.data.note}`

    // texture
    document.getElementById('product_texture').textContent = `${objData.data.texture}`

    document.getElementById('product_description').textContent = `${objData.data.description}`

    document.getElementById('product_wash').textContent = `${objData.data.wash}`
    document.getElementById('product_place').textContent = `${objData.data.place}`

    document.getElementById('product_story').textContent = `${objData.data.story}`

    // 放入image
    for (let x = 0; x < objData.data.images.length; x++) {
      const outElement = document.getElementById('product')
      const addNewChild = document.createElement('img')
      addNewChild.classList.add('product_image')
      addNewChild.src = objData.data.images[x]
      outElement.appendChild(addNewChild)
    }

    // product數量減少
    document.getElementById('decrement').addEventListener('click', (event) => {
      let nowNum = document.getElementById('quantity').textContent

      if (+nowNum > 1) {
        nowNum = +nowNum - 1
        productNowSelect[3] = nowNum
        document.getElementById('quantity').textContent = nowNum
      }
    })

    // product數量增加
    document.getElementById('increment').addEventListener('click', () => {
      let maxStorck = 1

      // 爆搜 stock的最大值
      for (let i = 0; i < objVariants.data.length; i++) {
        if (productNowSelect[0] === objVariants.data[i].color_code) {
          if (productNowSelect[1] === objVariants.data[i].size) {
            maxStorck = objVariants.data[i].stock
          }
        }
      }

      let nowNum = document.getElementById('quantity').textContent
      if (+nowNum < maxStorck) {
        nowNum = +nowNum + 1
        productNowSelect[3] = nowNum

        document.getElementById('quantity').textContent = nowNum
      }
    })
  }

  // 設定購物車的icon數量
  const carNumber = JSON.parse(localStorage.getItem('car'))
  if (carNumber == null) {
    document.getElementById('count').textContent = 0
  } else {
    document.getElementById('count').textContent = carNumber.length
  }
}

// 抓取api資料
const queryParamsString = window.location.search.substr(1).split('id%EF%BC%9D')
const productId = queryParamsString[1]
xhr.open('GET', `http://localhost:3000/api/1.0/products/details?id=${productId}`, true)
xhr.send()

// 將產品加入購物車
document.getElementById('add-to-cart').addEventListener('click', () => {
  if (productNowSelect[0] !== undefined && productNowSelect[1] !== undefined) {
    const xhrButtone = new XMLHttpRequest()

    xhrButtone.open('POST', 'http://localhost:3000/product.html', true)
    xhrButtone.setRequestHeader('Content-type', 'application/json')

    // Product整理資料
    const newProduct = {}
    newProduct.id = objProduct.data.id
    newProduct.name = objProduct.data.title
    newProduct.price = objProduct.data.price
    newProduct.color = productNowSelect[0]
    newProduct.size = productNowSelect[1]
    newProduct.stock = productNowSelect[3]
    newProduct.images = objProduct.data.main_image

    const youCar = JSON.parse(localStorage.getItem('car'))

    if (youCar == null) {
      // 如果local沒有資料，直接阿斯！
      window.localStorage.setItem('car', JSON.stringify([newProduct]))
    } else {
      // 把local的資料拆開
      const allProduct = []
      let ifAdd = 0
      for (let i = 0; i < youCar.length; i++) {
        // 將重複的product整理成同個LocalStorage
        if (newProduct.color === youCar[i].color && newProduct.size === youCar[i].size) {
          youCar[i].stock = (newProduct.stock + youCar[i].stock)
          allProduct[i] = youCar[i]
          ifAdd = 1
        } else {
          allProduct[i] = youCar[i]
        }
      }
      // 把最後的資料放入
      if (ifAdd === 0) {
        allProduct.push(newProduct)
        window.localStorage.setItem('car', JSON.stringify(allProduct))
      } else {
        window.localStorage.setItem('car', JSON.stringify(allProduct))
      }
    }

    // 傳送資料到後端
    const userData = JSON.stringify(newProduct) // 問題4你!
    xhrButtone.send(userData)
    // 更改購物車的Num
    const carNumber = JSON.parse(localStorage.getItem('car')).length
    if (carNumber == null) {
      document.getElementById('count').textContent = 0
    } else {
      document.getElementById('count').textContent = carNumber
    }

    alert('已加入購物車')
  } else {
    alert('你想買三毀..?\n當我塑膠？以為這樣就會error？')
    console.log('你想買三毀..?你他X的...什麼都沒有選...你....甘..')
  }
})
