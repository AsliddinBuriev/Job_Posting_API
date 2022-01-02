import cors from "cors";
import express from "express";
import { errorController } from "./Controllers/errorController.js";
import jobRouter from "./Routes/jobRouter.js";
import userRouter from "./Routes/userRouter.js";
import MakeError from "./utils/MakeError.js";
const app = express();


/*******      GLOBAL MIDDLEWARES    ********/
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*******      ROUTES    ********/
app.use('/api/v1/job', jobRouter)
app.use('/api/v1/user', userRouter)

/*******      WRONG ROUTE    ********/
app.all('*', (req, res, next)=>{
  next(new MakeError( `${req.originalUrl} does not exist`, 404))
})

/*******      ERROR    ********/
app.use(errorController)

export default app

