import path from 'path';
import multer from 'multer';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'flask-app/userdataset/'); 
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);n
      cb(null, Date.now() + ext); 
    }
  });

  var uploadMiddleware = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 2, 
    },
    fileFilter: function (req, file, callback) {
      if (file.mimetype === 'text/csv') {
        callback(null, true);
      } else {
        console.log('File is in the wrong format');
}
        callback(null, false);
      }
  });

  export const uploadUserFiles = uploadMiddleware.single('file');

  export default uploadUserFiles;