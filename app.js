const express = require('express')
const {getCategories} = require('./controllers/categoryControllers')
const {getReviews, getReviewId} = require('./controllers/reviewsControllers')
const {getComments} = require('./controllers/commentsControllers')
const {status500Error, status404Error, psqlErrorHandler, custom404Error} = require("./controllers/errorControllers")
const app = express()


app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewId )

app.get('api/reviews/:review_id/comments', getComments)

app.all("/*", status404Error)


app.use(psqlErrorHandler)

app.use(custom404Error)

app.use(status500Error)

module.exports = app;