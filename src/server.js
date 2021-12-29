import { config } from "dotenv";
import mongoose from "mongoose";
import { resolve } from "path";
import app from "./app.js";

config({
  path: resolve('config.env'),
});

const pw = encodeURIComponent(process.env.DATABASE_PW)
const uri = process.env.DATABASE_URI.replace('<password>', pw)

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(res => {
  console.log('DB is connected');
})


const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`THE API IS RUNNING ON PORT ${port}`);
})