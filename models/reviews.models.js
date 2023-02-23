const db = require("../db/connection");

exports.selectReviews = () => {
  return db
    .query(
      `
        SELECT reviews.*, COUNT(comments.review_id) AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON comments.review_id = reviews.review_id 
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC;
    `
    )
    .then(({ rows }) => rows); 
};

exports.selectReview = (review_id) => {

    return db
    .query(
        `SELECT * FROM reviews WHERE review_id = $1;`, [review_id]
    )
    .then(({rows}) => {
      
      
      if(rows.length === 0){
        return Promise.reject({status: 404, message: "Review_id not found"})
      }


     return rows[0];
    })
}

