const db = require("../db/connection");

exports.selectReviews = (category, sort_by = "created_at", order = "DESC") => {
  // default values for queries

  const sortGreenList = [
    //array of valid sort_by options
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "created_at",
    "votes",
  ];

  const orderGreenList = ["ASC", "DESC"]; // array of valid order options

  if (!sortGreenList.includes(sort_by) || !orderGreenList.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad Request!"}); //checks if sort or order query is valid, sends error if not
  }

  if (category) {
    let categoryQuery = category;
    const checkCategoryStr = `
    SELECT * FROM categories
    WHERE slug = $1 `;
  
  return db
    .query(checkCategoryStr, [categoryQuery])    //query to check if category is real?
    .then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found"});
      } else {
        let selectReviewsStr = `
        SELECT reviews.*, COUNT(comments.review_id) 
        AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id 
        WHERE reviews.category = $1
        GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order};`;  //uses queries in sql query   
        return db.query(selectReviewsStr, [category])
        .then(({ rows }) => {
          return rows;
        }); 
      };
    });
  } else {
    let selectReviewsStr = `
    SELECT reviews.*, COUNT(comments.review_id) 
    AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id 
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order};`; 
    return db.query(selectReviewsStr)  // run this is no category query present
    .then(({ rows }) => {
      return rows;
    });
  };
}

exports.selectReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Review_id not found" });
      }

      return rows[0];
    });
};

exports.insertVotes = (review_id, inc_votes) => {
  return db
    .query(
      `
    SELECT *
    FROM reviews
    WHERE review_id = $1;
    `,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Review_id not found" });
      } else {
        return db.query(
          `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
    `,
          [inc_votes, review_id]
        );
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
