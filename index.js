const express = require('express');
const { send } = require('process');
const path = require('path');
const app = express();

app.use(express.static('public'));


// app.set('public engine', 'html');

app.get('/', (req, res) =>{
  res.sendFile(__dirname + '/public/welcome.html');

});

app.listen(3000, () =>{
  console.log('run on 3000');
});