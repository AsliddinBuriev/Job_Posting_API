import cors from 'cors';
import express from 'express';
import { errorController } from './Controllers/errorController.js';
import jobRouter from './Routes/jobRouter.js';
import userRouter from './Routes/userRouter.js';
import MakeError from './utils/MakeError.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

const app = express();

/*******      GLOBAL MIDDLEWARES    ********/
//set cors middleware
app.use(cors());

//set helmet
app.use(helmet());

//limit requests from the same IP
const apiLimiter = rateLimit({
  max: 100,
  windowMs: 30 * 60 * 1000,
  message:
    'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

//body-parser reading data from req.body
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false }));

//data sanitization against Nosql query injection
app.use(mongoSanitize());
//data sanitization against XSS
app.use(xss());
//prevet http parameter polution
app.use(hpp());
/*******      ROUTES    ********/
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/user', userRouter);

/*******      WRONG ROUTE    ********/
app.all('*', (req, res, next) => {
  next(new MakeError(`${req.originalUrl} does not exist`, 404));
});

/*******      ERROR    ********/
app.use(errorController);

export default app;
