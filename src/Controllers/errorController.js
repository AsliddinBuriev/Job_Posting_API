import MakeError from './../utils/MakeError.js'


export const errorController = (err, req, res, next)=>{
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if(process.env.NODE_ENV === 'production'){
    let error = Object.create(err)
    if(err.name === 'CastError') error = castError(err);
    if(err.name === 'ValidationError') error = validationError(err)
    prodError(error, res)
  }else if (process.env.NODE_ENV === 'development'){
    devError(err, res)
  } 
}

//production error 
function prodError(err, res){
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }else{
    res.status(500).json({
      status:'error',
      message: 'Something went very wrong!',
      err
    })
  }
  
}
//development error 
function devError(err, res){
  res.status(err.statusCode).json({
    err
  })
}

//cast error || invalid field
function castError(err){
  return new MakeError(`Invalid ${err.path}:${err.value}`, 400)
}

//mongoose validation error
function validationError(err){
  return new MakeError(err.message, 400)
}
