import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

export const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const newFilename = `projectImage-${Date.now()}.webp`;
  const outputPath = path.join('uploads', newFilename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat('webp', { quality: 80 })
      .toFile(outputPath);

    req.file.filename = newFilename;
    req.file.path = outputPath;
    req.file.mimetype = 'image/webp';

    next();
  } catch (error) {
    console.error('Error optimizing image:', error);
    res.status(500).json({ message: 'Error processing image' });
  }
};

export const uploadSingle = upload.single('projectImage');