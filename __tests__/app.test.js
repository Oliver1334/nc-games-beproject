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

describe('GET: /api/categories errors', () => {
            test('responds with an error message to a non-existant endpoint', ()=> {
               return request(app)
                    .get('/api/notAnEndpoint')
                    .expect(404)
                    .then((res)=>{
                        expect(res.body.msg).toBe("Error 404 not found!")
                    })
            })
        });

        // describe.only('GET: 200 /api/review', () => {
        //     test('responds with a reviews array of review objects.', () => {
        //         return request(app)
        //             .get('/api/review')
        //             .expect(200)
        //             .then(({body})=>{
        //                 console.log(body)
        //                 const { treasures } = body
                   
        //                 });
        //             })
        //     })
    




            // a reviews array of review objects, each of which should have the following properties:

            // owner
            
            // title
            
            // review_id
            
            // category
            
            // review_img_url
            
            // created_at
            
            // votes
            
            // designer
            
            // comment_count which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this.
            
            // the reviews should be sorted by date in descending order.


