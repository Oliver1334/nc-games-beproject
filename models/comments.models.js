const db = require("../db/connection");

exports.selectComments = (review_id) => {
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
            SELECT *
            FROM comments
            WHERE review_id = $1
            ORDER BY created_at DESC
            `,
          [review_id]
        );
      }
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (review_id, username, body) => {
  return db
    .query(
      `
      SELECT *
      FROM users
      WHERE username = $1;
    `,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Username not found!" });
      } else {
        return db.query(
          `
          SELECT *
          FROM reviews
          WHERE review_id = $1
          `,
          [review_id]
        );
      }
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Review_id not found" });
      } else {
        return db.query(
          `
        INSERT INTO comments (body, author, review_id)
        VALUES ($1,$2,$3)
        RETURNING *;
      `,
          [body, username, review_id]
        );
      }
    })
    .then(({ rows }) => {
      return rows;
    });
};
