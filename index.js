const express = require('express');
const multer = require('multer');
const app = express()
const port = 3000
app.get('/', (req, res) => {
  console.log("GET HOME", req)
  res.sendFile('public/index.html' , { root : __dirname});
})
app.post('/upload', (req, res)=>{
  console.log("REQ",req.body);
  res.send("hello");

})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})