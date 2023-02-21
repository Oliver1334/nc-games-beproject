const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const db = require('../db/connection')

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    db.end();
})


describe('GET: 200 /api/categories', () => {
    test('responds with an array of category objects with the properties: slug and description', () => {
    
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            const {categories} = body
            categories.forEach(category => {
                expect(category).toHaveProperty('slug', expect.any(String))
                expect(category).toHaveProperty('description', expect.any(String))
            })
        })
    })

});

describe.only('GET: /api/categories or GET: /api/reviews errors', () => {
            test('responds with an error message to a non-existent endpoint', ()=> {
               return request(app)
                    .get('/api/notAnEndpoint')
                    .expect(404)
                    .then((res)=>{
                        expect(res.body.msg).toBe("Error 404 not found!")
                    })
            })
        });

        describe.only('GET: 200 /api/reviews', () => {
            test('responds with a reviews array of review objects including an added comment_count property', () => {
                return request(app)
                    .get('/api/reviews')
                    .expect(200)
                    .then(({body})=>{
                        const { reviews } = body
                   reviews.forEach(review => {
                    expect(review).toHaveProperty('owner', expect.any(String))
                    expect(review).toHaveProperty('title', expect.any(String))
                    expect(review).toHaveProperty('review_id', expect.any(Number))
                    expect(review).toHaveProperty('category', expect.any(String))
                    expect(review).toHaveProperty('review_img_url', expect.any(String))
                    expect(review).toHaveProperty('created_at', expect.any(String))
                    expect(review).toHaveProperty('votes', expect.any(Number))
                    expect(review).toHaveProperty('designer', expect.any(String))
                    expect(review).toHaveProperty('comment_count', expect.any(String))
                    //Don't have many ideas on testing that the comment_count is correct, but the SQL query is working
                   })
                        });
                    })
            test('Reviews should be sorted by date in ascending order in the array', () => {
                return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({body})=>{
                    const {reviews} = body
                    expect(reviews).toBeSorted({ ascending: true})
                })
            })
            })
    

        

