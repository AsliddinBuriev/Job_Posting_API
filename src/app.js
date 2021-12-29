import cors from "cors";
import express from "express";
import jobRouter from "./Routes/jobRouter.js";


const app = express();


/*******      GLOBAL MIDDLEWARES    ********/
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*******      ROUTES    ********/
app.use('/api/v1/job', jobRouter)




export default app

