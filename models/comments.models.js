const db = require("../db/connection")

exports.selectComments = (review_id) => {
    return db
    .query(
        `
        
        `
    )
    .then(({ rows }) => rows);
};