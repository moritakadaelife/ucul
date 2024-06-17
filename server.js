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
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

const fileStatus = {};

app.post('/upload', upload.array('files', 10), (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).send({ message: 'No files uploaded.' });
  }

  files.forEach((file) => {
    fileStatus[file.filename] = { status: 'processing', originalname: file.originalname };
    // Simulate AI processing
    setTimeout(() => {
      fileStatus[file.filename].status = 'completed';
    }, 1000); // 10 seconds delay to simulate processing
  });

  res.status(200).json({
    message: 'Files uploaded successfully',
    files: files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
    })),
  });
});

app.get('/status/:filename', (req, res) => {
  const filename = req.params.filename;
  const status = fileStatus[filename];
  if (!status) {
    return res.status(404).json({ message: 'File not found' });
  }
  res.status(200).json(status);
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.download(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
