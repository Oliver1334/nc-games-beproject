const { retrieveEndpoints } = require('../models/endPoints.models')


exports.getEndPoints = (req, res, next) => {
    return retrieveEndpoints()
    .then((data)=>{
        res.status(200).json({"endpoints": data})
    })
    .catch((err) => {
        next(err)
    })
}