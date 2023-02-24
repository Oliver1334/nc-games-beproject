const { selectReviews, selectReview, insertVotes } = require("../models/reviews.models")



exports.getReviews = (req, res, next) => {
    selectReviews()
      .then((reviews) => {
        res.status(200).send({ reviews });
      })
      .catch((err) => {
        next(err);
      });
  };

exports.getReviewId = (req, res, next) => {
  const {review_id} = req.params
  
  selectReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (req, res, next) => {
  const {review_id} = req.params;
  const {inc_votes} = req.body;

insertVotes(review_id, inc_votes)
.then((review) => {
  res.status(200).send({review})
})
.catch((err) => {
  next(err);
});
}




  