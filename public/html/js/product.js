console.log('konodioda')

const xhr = new XMLHttpRequest()

// 獲得資料，準備新增東西。
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    console.log(productId)
    const data = xhr.responseText
    const objData = JSON.parse(data)
    // const getLength = Object.keys(objData.data).length
    console.log(objData)

    console.log(objData.data.main_image)

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
      outElement.appendChild(addNewChild)
    }

    // 放入size按鈕
    for (let i = 0; i < objData.data.sizes.length; i++) {
      const outElement = document.getElementById('product_sizes')
      const addNewChild = document.createElement('div')
      addNewChild.classList.add('product_size')
      addNewChild.textContent = objData.data.sizes[i]
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

    // let dagg = objData.data.images;
    // console.log(dagg);
  }
}

// 抓取api資料
const queryParamsString = window.location.search.substr(1).split('id%EF%BC%9D')
const productId = queryParamsString[1]
xhr.open('GET', `http://3.13.254.132/api/1.0/products/details?id=${productId}`, true)
xhr.send()
