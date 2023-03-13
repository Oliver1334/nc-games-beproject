const express = require("express");
const { getCategories } = require("./controllers/categoryControllers");
const { getReviews, getReviewId, updateVotes } = require("./controllers/reviewsControllers");
const {
  getComments,
  postCommentOnReview,
} = require("./controllers/commentsControllers");
const {
  status500Error,
  status404Error,
  psqlErrorHandler,
  custom404Error,
} = require("./controllers/errorControllers");
const app = express();
const cors = require ('cors');

app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewId);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postCommentOnReview);

app.patch("/api/reviews/:review_id", updateVotes)




app.all("/*", status404Error);



app.use(psqlErrorHandler);

app.use(custom404Error);

app.use(status500Error);

module.exports = app;
