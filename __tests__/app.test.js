const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const { ident } = require("pg-format");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET: 200 /api/categories", () => {
  test("responds with an array of category objects with the properties: slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug", expect.any(String));
          expect(category).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET: /api/categories or GET: /api/reviews errors", () => {
  test("responds with an error message to a non-existent endpoint", () => {
    return request(app)
      .get("/api/notAnEndpoint")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Error 404 not found!");
      });
  });
});

describe("GET: 200 /api/reviews", () => {
  test("responds with a reviews array of review objects including an added comment_count property", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toHaveProperty("owner", expect.any(String));
          expect(review).toHaveProperty("title", expect.any(String));
          expect(review).toHaveProperty("review_id", expect.any(Number));
          expect(review).toHaveProperty("category", expect.any(String));
          expect(review).toHaveProperty("review_img_url", expect.any(String));
          expect(review).toHaveProperty("created_at", expect.any(String));
          expect(review).toHaveProperty("votes", expect.any(Number));
          expect(review).toHaveProperty("designer", expect.any(String));
          expect(review).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
  test("Reviews should be sorted by date in ascending order in the array", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET:200 /api/reviews/:review_id", () => {
  test("responds with a review object with 9 properties", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review.review_id).toBe(4);
        expect(review).toHaveProperty("title", expect.any(String));
        expect(review).toHaveProperty("category", expect.any(String));
        expect(review).toHaveProperty("designer", expect.any(String));
        expect(review).toHaveProperty("owner", expect.any(String));
        expect(review).toHaveProperty("review_body", expect.any(String));
        expect(review).toHaveProperty("review_img_url", expect.any(String));
        expect(review).toHaveProperty("created_at", expect.any(String));
        expect(review).toHaveProperty("votes", expect.any(Number));
      });
  });
});


describe("GET: /api/reviews/:review_id errors", () => {
  test("responds with a bad request 400 error message for an invalid id", () => {
    return request(app)
      .get("/api/reviews/notAnId")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
  test("404: responds with custom error msg when sent a query with a valid ID but non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then((res) => {
        expect(res.text).toBe("Review_id not found");
      });
  });
});


describe("GET:200 /api/reviews/:review_id/comments", () => {
  test("responds with an array of comments objects for the given review_id with 6 properties", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment.review_id).toBe(3);
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
      });
  });
  test("The returned comments array should be ordered with the most recent comments first!", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("When a Valid review ID is used but there are no comments for that ID a blank comments array is returned", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});

describe("GET: /api/reviews/:review_id/comments errors", () => {
  test("Responds with a 404 custom error message when a valid but non existent review ID is input", () => {
    return request(app)
      .get("/api/reviews/15/comments")
      .expect(404)
      .then((res) => {
        expect(res.text).toBe("Review_id not found");
      });
  });
});

describe("POST: 201 /api/reviews/:review_id/comments", () => {
  test("Adds a comment with a request body object of username and body for a review to the comments data and returns the comment", () => {
    const reqBody = {
      username: "dav3rid",
      body: "I hate werewolves, I would rather play something about vampires!",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(reqBody)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment[0].comment_id).toBe(7);
        expect(comment[0].body).toBe(
          "I hate werewolves, I would rather play something about vampires!"
        );
        expect(comment[0].review_id).toBe(3);
        expect(comment[0].author).toBe("dav3rid");
        expect(comment[0].votes).toBe(0);
        expect(comment[0]).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("Ignores extra data from a request body and makes a successful post", () => {
    const reqBody = {
      username: "mallionaire",
      body: "Boy do i LOVE werewolves!",
      extraData: "Really really love werewolves.",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(reqBody)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment[0].comment_id).toBe(7);
        expect(comment[0].body).toBe("Boy do i LOVE werewolves!");
        expect(comment[0].review_id).toBe(3);
        expect(comment[0].author).toBe("mallionaire");
        expect(comment[0].votes).toBe(0);
        expect(comment[0]).toHaveProperty("created_at", expect.any(String));
      });
  });
});

describe("POST:/api/reviews/:review_id/comments errors", () => {
  test("responds with a 404 not found for a request body with a username that doesn't exist in the database", () => {
    const reqBody = {
      username: "unknown666",
      body: "I hate werewolves, I would rather play something about vampires!",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.text).toBe("Username not found!");
      });
  });
  test("responds with a 400 error when request body has incorrect values", () => {
    const reqBody = {
      author: "dav3rid",
      text: "I hate werewolves, I would rather play something about vampires!",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request, incorrect values!");
      });
  });

  test("responds with a 400 error when given an invalid review ID", () => {
    const reqBody = {
      username: "dav3rid",
      body: "I hate werewolves, I would rather play something about vampires!",
    };
    return request(app)
      .post("/api/reviews/notAnId/comments")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
  test("404: responds with custom error msg when sent a query with a review_id that is out of range", () => {
    const reqBody = {
      username: "dav3rid",
      body: "I hate werewolves, I would rather play something about vampires!",
    };
    return request(app)
      .post("/api/reviews/999/comments")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.text).toBe("Review_id not found");
      });
  });
});

describe("PATCH: 200 /api/reviews/:review_id", () => {
  test("Takes an object with the property inc_votes and updates the corresponding review from id incrementing or decrementing the vote count by the number specified in the object. Returns the review. ", () => {
    const reqBody = {inc_votes: 5};
    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(200)
      .then(({ body }) => {
        const {review} = body
        expect(review.votes).toBe(6)
        expect(review.review_id).toBe(1)
        expect(review).toHaveProperty("title", expect.any(String));
        expect(review).toHaveProperty("category", expect.any(String));
        expect(review).toHaveProperty("designer", expect.any(String));
        expect(review).toHaveProperty("owner", expect.any(String));
        expect(review).toHaveProperty("review_body", expect.any(String));
        expect(review).toHaveProperty("review_img_url", expect.any(String));
        expect(review).toHaveProperty("created_at", expect.any(String));

      });
  });
  test("Works for decrementing votes", () => {
    const reqBody = {inc_votes: -100};
    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(200)
      .then(({ body }) => {
        const {review} = body
        expect(review.votes).toBe(-99)
      });
  });
  test("Ignores extra data added to the request body", () => {
    const reqBody = {inc_votes: 5,
    moreVotes: 6};
    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(200)
      .then(({ body }) => {
        const {review} = body
        expect(review.votes).toBe(6)
        expect(review.review_id).toBe(1)
        expect(review).toHaveProperty("title", expect.any(String));
        expect(review).toHaveProperty("category", expect.any(String));
        expect(review).toHaveProperty("designer", expect.any(String));
        expect(review).toHaveProperty("owner", expect.any(String));
        expect(review).toHaveProperty("review_body", expect.any(String));
        expect(review).toHaveProperty("review_img_url", expect.any(String));
        expect(review).toHaveProperty("created_at", expect.any(String));

      });
});
});

describe("PATCH:/api/reviews/:review_id ERRORS", () => {
  test("responds with a 400 bad request for a request body missing the required inc_votes property", () => {
    const reqBody = {newVotes: 5}
    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
  test("responds with a 400 bad request for a request body with inc_votes value as a string not a number", () => {
    const reqBody = {inc_votes: "five"}
    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });

  test("responds with a 400 error when given an invalid review ID", () => {
    const reqBody = {inc_votes: 5}
    return request(app)
      .patch("/api/reviews/notAnId")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
  test("404: responds with custom error msg when sent a query with a review_id that is out of range", () => {
    const reqBody = {inc_votes: 5}
    return request(app)
      .patch("/api/reviews/999")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.text).toBe("Review_id not found");
      });
  });
});

describe("GET: 200 /api/users", () => {
  test("responds with an array of user objects including username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((review) => {
          expect(review).toHaveProperty("username", expect.any(String));
          expect(review).toHaveProperty("name", expect.any(String));
          expect(review).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe.only("GET: 200 /api/reviews using queries", () => {
  test('returns all reviews from a specified category', () => {
    return request(app).get('/api/reviews?category=social+deduction')
    .expect(200)
    .then(({body}) => {
      const {reviews} = body;
      expect(reviews.length).toBe(11)
      reviews.forEach((review) => {
        expect(review.category).toBe('social deduction')
      });
    });
  });
  test('Returns all reviews sorted by designer, descending by default when no order query is present', () => {
    return request(app).get('/api/reviews?sort_by=designer')
    .expect(200)
    .then(({body}) => {
      const {reviews} = body;
      console.log(reviews)
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy('designer', {descending : true})
    });
  });
  test('Returns all reviews sorted by owner, in ascending order', () => {
    return request(app).get('/api/reviews?sort_by=owner&order=ASC')
    .expect(200)
    .then(({body}) => {
      const {reviews} = body;
      console.log(reviews)
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy('owner', {ascending : true})
    });
  });
  test('Returns all reviews sorted by owner, in ascending order with the category of social deduction', () => {
    return request(app).get('/api/reviews?sort_by=owner&order=ASC&category=social+deduction')
    .expect(200)
    .then(({body}) => {
      const {reviews} = body;
      console.log(reviews)
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy('owner', {ascending : true})
      reviews.forEach((review) => {
        expect(review.category).toBe('social deduction')
    });
  });
})
test('Returns all reviews sorted by date created, in ascending order with the category of dexterity', () => {
  return request(app).get('/api/reviews?sort_by=created_at&order=ASC&category=dexterity')
  .expect(200)
  .then(({body}) => {
    const {reviews} = body;
    console.log(reviews)
    expect(reviews.length).not.toBe(0);
    expect(reviews).toBeSortedBy('created_at', {ascending : true})
    reviews.forEach((review) => {
      expect(review.category).toBe('dexterity')
  });
});
});
test('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=created_at')
  .expect(200)
  .then(({body}) => {
    const {reviews} = body;
    expect(reviews).toBeSortedBy('created_at', {descending : true})
});
});
test('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=created_at')
  .expect(200)
  .then(({body}) => {
    const {reviews} = body;
    expect(reviews).toBeSortedBy('created_at', {descending : true})
});
});
test('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=created_at')
  .expect(200)
  .then(({body}) => {
    const {reviews} = body;
    expect(reviews).toBeSortedBy('created_at', {descending : true})
});
});
test.only('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=rubbish')
  .expect(400)
  .then((res) => {
    expect(res.text).toBe("Bad Request!");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

test.skip('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
  return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
  .expect(400)
  .then(({body}) => {
    expect(body.message).toBe("Bad Request");
});
});

});

// error testing


// test('When attempting to sort by an invalid value a 400 bad request error is sent', () => {
//   return request(app).get('/api/reviews?sort_by=wrongvalue&order=ASC&category=dexterity')
//   .expect(400)
//   .then({body}) => {
//     expect(body.msg).toBe("Bad Request")
//   }
//   });
// })








// Request body accepts:

// an object in the form { inc_votes: newVote }

// newVote will indicate how much the votes property in the database should be updated bye.g.

// { inc_votes : 1 } would increment the current review's vote property by 1

// { inc_votes : -100 } would decrement the current review's vote property by 100

// Responds with:

// the updated review
// Error handling 
// 400 error missing required fields (newvote: 100) and one for (incvote: "100")
// 400 bad request (votes:word)
// custom 404 out of range review id
// 404 review id notanID 
