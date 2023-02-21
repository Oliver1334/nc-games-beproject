const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const {getReviews} = require('./controllers/reviewsControllers')
const {status500Error, status404Error} = require("./controllers/errorControllers")
const app = express()


app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)




app.all("/*", status404Error)

app.use(status500Error)

module.exports = app;