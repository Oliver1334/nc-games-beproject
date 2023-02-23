const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");

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
          const {comments} = body
          comments.forEach((comment) => {
          expect(comment.review_id).toBe(3);
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
        })
        });
    });
    test("The returned comments array should be ordered with the most recent comments first!", () => {
      return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const {comments} = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
    })
    test("When a Valid review ID is used but there are no comments for that ID a blank comments array is returned", () => {
      return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        const {comments} = body;
        expect(comments).toEqual([])
      });
    })
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
  })







