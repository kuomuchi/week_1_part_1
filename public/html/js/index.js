console.log("hi");

var xhr = new XMLHttpRequest();

//獲得資料，準備新增東西。
xhr.onreadystatechange = function(){
  if(xhr.readyState == 4){

    //for()
  
    var data = xhr.responseText;
    var objData = JSON.parse(data);
    var getLength = Object.keys(objData.data).length;
    console.log(objData);
    
    //創建最外層的tag「a」class="product"
    var outElement = document.getElementById('product_box');
    var addNewChild = document.createElement('a');

    //新增ClassName
    addNewChild.classList.add('prudoct');
    //設置觸發跳轉的頁面，跳轉頁面為id
    addNewChild.href = `/admin/html/product.html?id${objData.data[0].id}`
    addNewChild.textContent = objData.data[0].id;
    //將新child push上來。
    outElement.appendChild(addNewChild);


    //指定product為外側的Element
    outElement = document.querySelectorAll("div.product_box > a.prudoct")[0];
    //新增img tag
    addNewChild = document.createElement('img');
    //設定照片src位置
    addNewChild.src = 'https://api.appworks-school.tw/assets/201807201824/main.jpg';
    //push child
    outElement.appendChild(addNewChild);

    //create Product colors...shit...
    addNewChild = document.createElement('div');
    addNewChild.classList.add('product__colors');
    outElement.appendChild(addNewChild);

    //建立div.color底下的色塊
    outElement = document.querySelectorAll("div.product_box > a.prudoct > div.product__colors")[0];
    var colorLength = objData.data[0].colors.length;
    //或的Api.Color 的長度
    for(let u=0; u<colorLength; u++){
      addNewChild = document.createElement('div');
      addNewChild.classList.add('product__color');
      addNewChild.style.backgroundColor = objData.data[0].colors[u].code;
      outElement.appendChild(addNewChild);
    }
    
    

    

    //outElemant > product
    outElement = document.querySelectorAll("div.product_box > a.prudoct")[0];
    //創建Product的title
    addNewChild = document.createElement('div');
    //add class
    addNewChild.classList.add('product__title');
    //text = api.title
    addNewChild.textContent = objData.data[0].title;
    //push Child
    outElement.appendChild(addNewChild);


    //創建Product的price
    addNewChild = document.createElement('div');
    //add class
    addNewChild.classList.add('product__price');
    //text = api.price
    addNewChild.textContent = objData.data[0].price;
    //push Child
    outElement.appendChild(addNewChild);




  }
}

//抓取api資料
xhr.open('GET', 'http://localhost:3000/api/1.0/products/all?paging=1');
xhr.send();