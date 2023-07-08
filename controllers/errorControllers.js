exports.status404Error = (request, response, next) => {
  response.status(404).send({ msg: "Error 404 not found!" });
};

exports.psqlErrorHandler = (error, request, response, next) => {

  const psqlErrors = ["22P02", "23502"]
  if (psqlErrors.includes(error.code)) {
    response.status(400).send({ msg: "Bad Request!" });
  } else {
    next(error);
  }
};

exports.custom404Error = (error, request, response, next) => {

  if (error.status && error.message) {
    response.status(error.status).send(error.message);
  } else {
    next(error);
  }
};

// exports.custom400Error = (error, request, response, next) => {

//   if (err.status === "400") {
//     response.status(err.status).send(err.msg);
//   } else {
//     next(error);
//   }
// };

exports.status500Error = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Sorry we have a server error!" });
};
