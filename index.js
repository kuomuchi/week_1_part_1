const express = require('express');
const { send } = require('process');
const app = express();

app.get('/', (req, res) =>{
  res.send('YAAAAAA');
});

app.listen(3000, () =>{
  console.log('run on 3000');
});