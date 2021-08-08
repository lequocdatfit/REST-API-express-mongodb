const express = require('express');

const authenticate = require('../authenticate/authenticate');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const imageFileFilter = (req, file, cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  return cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const router = express.Router();

router.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('Get operation is not support on /imageUpload');
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(req.file);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('Put operation is not support on /imageUpload');
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('Delete operation is not support on /imageUpload');
})

module.exports = router;