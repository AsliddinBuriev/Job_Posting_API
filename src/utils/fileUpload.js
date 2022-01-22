import S3 from 'aws-sdk/clients/s3.js';
import multer from 'multer';

/******** MULTER FILE UPLOAD *******/
const fileFilter = (req, file, cb) => {
  const mimetype = file.mimetype.split('/');
  if (file.fieldname === 'resume' && mimetype[1] != 'pdf')
    cb(new MakeError('Please upload a pdf file!', 400), false);
  if (file.fieldname === 'photo' && mimetype[0] != 'image')
    cb(new MakeError('Please upload an image file!', 400), false);
  if (file.fieldname === 'photo' && mimetype[0] === 'image') {
    cb(null, true);
  } else if (file.fieldname === 'resume' && mimetype[1] === 'pdf') {
    cb(null, true);
  }
};
const storage = multer.memoryStorage();

export const multerFileUpload = multer({
  limits: { fileSize: 1048576 },
  fileFilter,
  storage,
});

/******** UPLOAD FILE TO S3 *******/
export const fileUploadToS3 = (Body, Key) => {
  const s3 = new S3();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key,
    Body,
  };
  return s3.upload(params).promise();
};
