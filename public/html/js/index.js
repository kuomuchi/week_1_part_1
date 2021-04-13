console.log('hi')

const xhr = new XMLHttpRequest()

// 獲得資料，準備新增東西。

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    const data = xhr.responseText
    const objData = JSON.parse(data)
    const getLength = Object.keys(objData.data).length
    console.log(objData)

    // 創建商品目錄
    for (let i = 0; i < getLength; i++) {
      // 創建最外層的tag「a」class="product"
      let outElement = document.getElementById('product_box')
      let addNewChild = document.createElement('a')

      // 新增ClassName
      addNewChild.classList.add('prudoct')
      // 設置觸發跳轉的頁面，跳轉頁面為id
      addNewChild.href = `/product.html?id＝${objData.data[i].id}`
      addNewChild.textContent = objData.data[i].id
      // 將新child push上來。
      outElement.appendChild(addNewChild)

      // 指定product為外側的Element
      outElement = document.querySelectorAll('div.product_box > a.prudoct')[i]
      // 新增img tag
      addNewChild = document.createElement('img')
      // 設定照片src位置
      addNewChild.src = `${objData.data[i].main_image}`
      // push child
      outElement.appendChild(addNewChild)

      // create Product colors...shit...
      addNewChild = document.createElement('div')
      addNewChild.classList.add('product__colors')
      outElement.appendChild(addNewChild)

      // 建立div.color底下的色塊
      outElement = document.querySelectorAll('div.product_box > a.prudoct > div.product__colors')[i]
      const colorLength = objData.data[i].colors.length
      // 或的Api.Color 的長度
      for (let u = 0; u < colorLength; u++) {
        addNewChild = document.createElement('div')
        addNewChild.classList.add('product__color')
        addNewChild.style.backgroundColor = objData.data[i].colors[u].code
        outElement.appendChild(addNewChild)
      }

      // outElemant > product
      outElement = document.querySelectorAll('div.product_box > a.prudoct')[i]
      // 創建Product的title
      addNewChild = document.createElement('div')
      // add class
      addNewChild.classList.add('product__title')
      // text = api.title
      addNewChild.textContent = objData.data[i].title
      // push Child
      outElement.appendChild(addNewChild)

      // 創建Product的price
      addNewChild = document.createElement('div')
      // add class
      addNewChild.classList.add('product__price')
      // text = api.price
      addNewChild.textContent = objData.data[i].price
      // push Child
      outElement.appendChild(addNewChild)
    }
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
xhr.open('GET', 'http://localhost:3000/api/1.0/products/all?paging=1', true)
xhr.send()

setTimeout(() => {
  // document.getElementById('hotPot').style
  document.getElementById('hotPot').classList.add('hotpotmove')
}, 3000)
