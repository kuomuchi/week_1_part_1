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
  });
  res.send('select....');
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
  let allpostdata = [req.body.title, req.body.description, req.body.price, req.body.texture, req.body.wash, req.body.place, req.body.note, req.body.story, req.body.pthging, req.body.sizes];


  for(let i=0; i<allpostdata.length; i++){
    //when find any input is null
    //then return get fail
    if(allpostdata[i] == ''){
      console.log('NO NULL YOU BAD BAD!!');
      res.sendFile(__dirname + '/public/errorPage.html');
      return
    }
  }

  //all colors table
  let colornum = ['#000ff', '#00ff00', '#ff0000'];
  //witch color user select
  let selectcolor = 0;

  if(allpostdata[8] == 'red'){
    selectcolor = 0;
  }else if(allpostdata[8] == 'green'){
    selectcolor = 1;
  }else{
    selectcolor = 2;
  }

  


  

  //if input != null
  //create a new thing

  let a = req.files[1].destination


  let post = {title: req.body.title, description: allpostdata[1], price: allpostdata[2], texture: allpostdata[3], wash: allpostdata[4], place: allpostdata[5], note: allpostdata[6], story: allpostdata[7], colors: `{ "${allpostdata[8]}": "${colornum[selectcolor]}"}`, sizes: `{"size": "${allpostdata[9]}"}`, main_image: req.files[0].destination+"/"+req.files[0].filename, images: `{"dest1": "${req.files[1].destination}/${req.files[1].filename}", "dest2": "${req.files[1].destination}/${req.files[1].filename}", "dest3": "${req.files[1].destination}/${req.files[1].filename}"}`};
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