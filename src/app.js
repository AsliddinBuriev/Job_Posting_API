const express = require('express')
const app = express();


/*******      GLOBAL MIDDLEWARES    ********/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/*******      ROUTES    ********/



module.exports = app

