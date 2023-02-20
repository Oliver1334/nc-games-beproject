exports.status500Error = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: "Sorry we have a server error!" });
  };
// if error.code is equal to a string of any 5 letters then send (response) else next(err)


  exports.status404Error = (request, response, next) => {
    response.status(404).send({ msg: "Error 404 not found!" });
  };
