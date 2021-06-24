// call all the required packages
const express = require('express')
const multer = require('multer');
const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();
const port = 3000;
const app = express();
const fs = require('fs');
const storage = multer.diskStorage({ // storage
  destination: function (req, file, cb) {
    cb(null, __dirname + '/public/images')
  },
  filename: function (req, file, cb) {
    const mimetype = file.mimetype.split('/')[1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + mimetype)
  }
})
var upload = multer({ storage: storage });

const bucketName = process.env.BUCKET
const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const s3 = new S3({
  accessKeyId,
  secretAccessKey
});

app.get('/', (req, res) => {
  res.sendFile('public/home.html', { root: __dirname })
})
app.post('/upload', upload.single('file'), (req, res, next) => {
  const file = req.file;
  console.log("FILE", req.file);
  const filepath = fs.createReadStream(file.path);
  const params = {
    Bucket: bucketName,
    Key: `${file.filename}`,
    Body: filepath
  };
  s3.putObject(params)
    .promise()
    .then(res => {
      console.log(`Upload succeeded - `, res);
    })
    .catch(err => {
      console.log("Upload failed:", err);
    });
  res.send("Success");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})