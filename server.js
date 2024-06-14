const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files', 10), (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).send({ message: 'No files uploaded.' });
  }

  res.status(200).send({
    message: 'Files uploaded successfully',
    files: files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
    })),
  });
});

app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to delete file' });
    }
    res.status(200).send({ message: 'File deleted successfully' });
  });
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.download(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
