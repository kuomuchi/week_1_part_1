require('dotenv').config();

const express = require('express');
const { send } = require('process');
const path = require('path');

const multer = require("multer");
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid').v4;
const { get } = require('http');



const storage = multer.diskStorage({
  destination: function(req, file, cd){
    cd(null, 'image');

  },
  filename : function(req, file, cb){
    const { originalname } = file;
    cb(null, originalname);
  }
});

const upload = multer({storage});


app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin', express.static('public'));


// app.set('public engine', 'html');

app.get('/', (req, res) =>{
  // res.sendFile(__dirname + '/public/welcome.html');
  console.log("Ko No Dio Da!!!");
  res.send('welcome');

});


//connect db
const db = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : process.env.DB_database
});

//connect db is err
db.connect((err) => {    
  if(err){
      throw err;
  }
});



app.get('/adduser1', (req, res)=>{
  let post = {title: 'test', description: 'testtest', price: '100', texture: 'sklky', wash: 'very hard', place: 'who know?', note:'this is so hard!', story: 'NO!', colors: '{"red": "#ff0000"}', sizes: '{"size": "M"}'};
  let sql = 'INSERT INTO product SET ?';
  let query = db.query(sql, post, (err, result) =>{
      if(err) throw err;
      console.log(result);
  });
  res.send('add a product');
});


app.get('/addobj', (req, res)=>{
  let post = {test: '{"red" : "#ff0000"}'};
  let sql = 'INSERT INTO salmon SET ?';
  let query = db.query(sql, post, (err, result) =>{
      if(err) throw err;
      console.log(result);
      
  });
  res.send('add some obj!!!');
});

app.get('/selectsalmon', (req, res)=>{
  let sql = 'SELECT * FROM salmon';
  let b = '';
  let query = db.query(sql, (err, results) =>{
      if(err) throw err;
      b = JSON.parse(JSON.stringify(results));
      console.log(b.length);
      console.log(results);
  });
  res.send('select....');
});



app.get('/selectusers', (req, res)=>{
  let sql = 'SELECT * FROM product';
  let b = '';
  let query = db.query(sql, (err, results) =>{
      if(err) throw err;
      b = JSON.parse(JSON.stringify(results));
      console.log(b.length);
      console.log(results);
      res.send('select...');
      return 
  });
  
});


//這是聆聽3000喔
app.listen(3000, () =>{
  console.log('run on 3000');
});

//in product there, when post! and.....do soemthing!
//當在「product.html」收到post時。
app.post('/admin/product.html', upload.array('main_image', 4), (req, res) =>{

  //get all post req, and make a array
  //取得所有的input post結果
  let allpostdata = [req.body.title, req.body.description, req.body.price, req.body.texture, req.body.wash, req.body.place, req.body.note, req.body.story];
  
  //所有的衣服尺碼
  let allsieze = [req.body.sizes, req.body.sizem, req.body.sizel, req.body.sizexl, req.body.sizexxl];
  //新建立一個array
  let postsize = [];

  //將所有的被選取的衣服size放入array。
  for(let i=0; i<allsieze.length; i++){
    let size = ['S', "M", "L", "XL", "XXL"];
    if(allsieze[i] == 'on'){
      postsize.push(size[i]);
    }
  }




  //抓取所有顏色的數值。
  let allcolor = [req.body.colorblue, req.body.colorred, req.body.colorgreen];
  let postcolor = [];
  let now=0;
  for(let i=0; i<allcolor.length; i++){
    let color = ['blue', 'red', 'green'];
    //all colors table
    let colornum = ['#0000ff', '#ff0000', '#00ff00'];

    //如果顏色為on
    if(allcolor[i] == 'on'){
      //加入一個物件。
      postcolor.push({});
      // postcolor.push(`{ "code": "${colornum[i]}" ,"name":"${color[i]}"}`); 這是失敗的方法

      //聰明人
      postcolor[now].code = colornum[i];
      postcolor[now].name = color[i];
      now++;
    }
  }



  //將images輸入array裡面
  let allimage = [];
  for(let i=1; i<req.files.length; i++){
    let thing = `${req.files[i].destination}/${req.files[i].filename}`;
    allimage.push(thing);
  }


  let chld = [];
  let chldnow = 0;
  for(let i=0; i<postcolor.length; i++){
    for(let u=0; u<postsize.length; u++){
      chld.push({});
      chld[chldnow].color_code = postcolor[i].code;
      chld[chldnow].size = postsize[u];
      chld[chldnow].stock =  Math.floor(Math.random()*100)+1;
      chldnow++;
    }
  }

  // console.log("this is chld" + chld[0].color_code + " and "+ chld[0].size + " and " + chld[0].stock);


  //把所有並非obj的資料，放入 FOR
  for(let i=0; i<allpostdata.length; i++){
    //when find any input is null
    //then return get fail
    if(allpostdata[i] == ''){
      console.log('NO NULL YOU BAD BAD!!');
      res.sendFile(__dirname + '/public/errorPage.html');
      return
    }
  }

  if(!req.files[0]){
    console.log('NO images YOU BAD BAD!!');
    res.sendFile(__dirname + '/public/errorPage.html');
    return
  }


  //if input != null
  //create a new thing
  let post = {title: req.body.title, description: allpostdata[1], price: allpostdata[2], texture: allpostdata[3], wash: allpostdata[4], place: allpostdata[5], note: allpostdata[6], story: allpostdata[7], colors: `${JSON.stringify(postcolor)}`, sizes: `{"size": "${postsize}"}` , variants: `{ "variants" : ${JSON.stringify(chld)}}` , main_image: req.files[0].destination+"/"+req.files[0].filename, images: `{"image" : "${allimage}"}`};
    let sql = 'INSERT INTO product SET ?';
    let query = db.query(sql, post, (err, result) =>{
        if(err) throw err;
        console.log(result);
    });

  
  //back to the 「product.html」
  res.sendFile(__dirname + '/public/product.html');
});






//test place

app.get('/admin/test.html', (req, res) =>{
  res.sendFile(_dirname + '/public/test.html');
});

app.post('/admin/test.html', upload.array('main', 3) ,(req, res) =>{
  //如果沒有收到圖片:D
  if(!req.files){
    //你壞壞！
    res.send('bad');
  }else{
    //你棒棒！！並且回傳圖片的位置。哭啊！
    // console.log(req.files+" + "+ req.files.length +" + "+ req.files[0].destination);
    console.log(req.files);
    res.json({upload : req.files});
  }
  
});