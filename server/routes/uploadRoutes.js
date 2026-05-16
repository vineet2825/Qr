const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.send({
    message: 'File uploaded successfully',
    url: `/${req.file.path.replace(/\\/g, '/')}`
  });
});

module.exports = router;
