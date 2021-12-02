const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
  res.status(200).json({
    status: success,
    data: 'test pipeline!'
  })
})

app.listen(3000, () => {
  console.log('The application is running on port 3000!');
})

