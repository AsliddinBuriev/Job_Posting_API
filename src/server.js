import { config } from 'dotenv';
import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import { resolve } from 'path';
import app from './app.js';
//uncaught exception error
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err.name, err.message);
  process.exit(1);
});
config({
  path: resolve('config.env'),
});
//database connection
const pw = encodeURIComponent(process.env.DATABASE_PW);
const url = process.env.DATABASE_URI.replace('<password>', pw);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log('DB is connected');
  });

//aws connection
AWS.config.update({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`THE API IS RUNNING ON PORT ${port}`);
});

//unhandled rejection error
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
