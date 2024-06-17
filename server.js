const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(fileUpload());
app.use(express.static('uploads'));

// ファイルのアップロードエンドポイント
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const files = req.files.files;
  const fileArray = Array.isArray(files) ? files : [files];
  const uploadPromises = fileArray.map((file) => {
    const uniqueFilename = `${uuidv4()}-${file.name}`;
    const uploadPath = path.join(__dirname, 'uploads', uniqueFilename);

    return file.mv(uploadPath).then(() => ({
      filename: uniqueFilename,
      originalname: file.name,
    }));
  });

  Promise.all(uploadPromises)
    .then((uploadedFiles) => {
      res.json({ files: uploadedFiles });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

// ファイルのステータス確認エンドポイント
app.get('/status/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.json({ status: 'completed', originalname: filename });
});

// ファイルのダウンロードエンドポイント
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
