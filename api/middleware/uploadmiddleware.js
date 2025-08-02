import path from 'path';
import multer from 'multer';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'flask-app/uploads/'); 
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname); 
    cb(null, Date.now() + ext); 
  },
});

var uploadMiddleware = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype === 'text/csv') {
      callback(null, true);
    } else {
      console.log('File is in the wrong format');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // Set file size limit (2MB per file)
  },
});

// Use `.array()` to handle multiple file uploads
export const uploadMultipleFiles = uploadMiddleware.array('files', 5); // Accept up to 5 files with the field name 'files'

export default uploadMultipleFiles;
