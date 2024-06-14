const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'Please upload a file.' });
  }

  res.status(200).send({
    message: 'File uploaded successfully.',
    filename: file.filename,
    originalname: file.originalname,
  });
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filepath)) {
    res.download(filepath, filename);
  } else {
    res.status(404).send({ message: 'File not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
