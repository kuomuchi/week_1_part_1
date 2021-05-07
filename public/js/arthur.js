console.log('hi')

const xhr = new XMLHttpRequest()
// 獲得資料，準備新增東西。
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    const data = xhr.responseText
    const sortData = JSON.parse(data)
    console.log(sortData)

    // getTotal
    document.getElementById('total').textContent = 'total sum: ' + sortData.data[0].total

    // getColor
    const color = []
    const colorName = []
    const colorNum = []
    for (let i = 0; i < sortData.data[1].length; i++) {
      color.push(sortData.data[1][i].code)
      colorName.push(sortData.data[1][i].name)
      colorNum.push(sortData.data[1][i].codeNum)
    }

    // 哇～畫出圓餅圖了誒～
    const ndata = [{
      values: colorNum,
      labels: colorName,
      marker: {
        colors: color
      },
      type: 'pie'
    }]
    const layout = {
      title: {
        text: 'Product sold percentage in different colors'
      },
      height: 400,
      width: 500
    }
    Plotly.newPlot('myDiv', ndata, layout)

    const price = []
    const qty = []

    for (let num = 0; num < sortData.data[2].length; num++) {
      price.push(sortData.data[2][num].price)
      qty.push(sortData.data[2][num]['SUM(qty)'])
    }

    // 真的很雞掰！
    const histogramx = []
    for (let a = 0; a < price.length; a++) {
      for (let i = 0; i < qty[a]; i++) {
        histogramx.push(price[a])
      }
    }
    console.log(histogramx)

    const trace = {
      x: histogramx,
      type: 'histogram'
    }
    const alayout = {
      title: {
        text: 'Product sold quantity in different price range'
      },
      xaxis: {
        title: {
          text: 'Price Range'
        }
      },
      yaxis: {
        title: {
          text: 'Quantity'
        }
      }
    }
    const adata = [trace]
    Plotly.newPlot('youDiv', adata, alayout)

    const size = [[], [], []]
    const productId = []
    for (let num = 0; num < 5; num++) {
      size[0].push(sortData.data[3][num].S)
      size[1].push(sortData.data[3][num].M)
      size[2].push(sortData.data[3][num].L)
      productId.push('product ' + sortData.data[3][num].id)
    }
    console.log(size)

    const trace1 = {
      x: productId,
      y: size[0],
      name: 'S',
      type: 'bar'
    }

    const trace2 = {
      x: productId,
      y: size[1],
      name: 'M',
      type: 'bar'
    }

    const trace3 = {
      x: productId,
      y: size[2],
      name: 'L',
      type: 'bar'
    }

    const dddata = [trace1, trace2, trace3]
    const ddlayout = {
      title: {
        text: 'Quantity of top 5 sold products in different sizes'
      },
      barmode: 'stack'
    }

    Plotly.newPlot('heDiv', dddata, ddlayout)
  }
}

// 抓取api資料
xhr.open('GET', '/api/1.0/order/getdata', true)
xhr.send()
