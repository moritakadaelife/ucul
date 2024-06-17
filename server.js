const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(fileUpload());
app.use(express.static(uploadDir));

app.use((req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFiles = [];

  for (let fileKey in req.files) {
    let file = req.files[fileKey];
    let uploadPath = path.join(uploadDir, file.name);
    file.mv(uploadPath, (err) => {
      if (err) return res.status(500).send(err);
      uploadedFiles.push({ filename: file.name, originalname: file.name });
    });
  }

  res.json({ files: uploadedFiles });
});

app.get('/status/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    res.json({ status: 'completed' });
  } else {
    res.status(404).send('File not found');
  }
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);
  res.download(filePath);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
