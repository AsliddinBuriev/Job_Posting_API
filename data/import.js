import { config } from 'dotenv';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import Job from './../src/Models/jobSchema.js';
config({ path: './config.env' });

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

const jobs = JSON.parse(
  readFileSync(new URL('sample_data.json', import.meta.url))
);

// const users = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
console.log(jobs);
const importData = async () => {
  try {
    await Job.create(jobs);
    console.log('data is successfully imported!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const cleanDB = async () => {
  try {
    await Job.deleteMany();
    console.log('db has been successfully cleaned!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  cleanDB();
}

console.log(process.argv);
