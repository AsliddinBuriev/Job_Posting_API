/******** POST JOB *******/
export const postJob = async (req, res, next) => {
  const message = req.body.message
  res.status('200').json({
    status: 'success',
    // message: 'You successfully posted the job!',
    message,
    data: 'no data yet'
  })
}