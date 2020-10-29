// =============================== MULTER ROUTES / TEST ONLY ==============================
// =============================== MULTER ROUTES / TEST ONLY ==============================
// =============================== MULTER ROUTES / TEST ONLY ==============================

const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// MULTER
// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
    );
    console.log(`fieldName : ${file.fieldname}`);
    console.log(`originalName : ${file.originalname}`);
  },
});

// FileTypeChecker
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check the extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check Mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images Only');
}

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 10000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('myImage');

router.get('/', (req, res) => {
  res.render('multer', { layout: 'mult', title: 'MULTER' });
});

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.render('multer', {
        layout: 'mult',
        err,
      });
    } else if (req.file === undefined) {
      res.render('multer', { layout: 'mult', err: 'No File Selected' });
    } else {
      console.log(req.file);
      console.log();
      res.render('multer', { layout: 'mult', err: 'test reeq', file: `uploads/${req.file.filename}` });
    }
  });
});
module.exports = router;
