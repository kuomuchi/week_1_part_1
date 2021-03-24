const express = require('express');
const { send } = require('process');
const app = express();

app.listen(3000, ()=>{
  console.log('80 ready');
});

app.get('/', (req, res) =>{
  res.send('YAAAAAA');
});