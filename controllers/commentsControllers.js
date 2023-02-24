const { selectComments, insertComment } = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;

  selectComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentOnReview = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;

  if (username === undefined || body === undefined) {
    res.status(400).send({ msg: "Bad request, incorrect values!" });
  } else {
    insertComment(review_id, username, body)
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  }
};
