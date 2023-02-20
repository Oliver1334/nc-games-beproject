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
        const testResult = [
            {
              slug: 'euro game',
              description: 'Abstact games that involve little luck'
            },
            {
              slug: 'social deduction',
              description: "Players attempt to uncover each other's hidden role"
            },
            {
              slug: 'dexterity',
              description: 'Games involving physical skill'
            },
            {
              slug: "children's games",
              description: 'Games suitable for children'
            }
          ];
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body}) => {
            const {categories} = body
            expect(categories).toEqual(testResult);
        })
    })

});

describe('GET: /api/categories errors', () => {
            test('responds with an error message to a non-existant endpoint', ()=> {
               return request(app)
                    .get('/api/notAnEndpoint')
                    .expect(404)
                    .then((res)=>{
                        console.log(res.body)
                        console.log(res.body.msg);
                        expect(res.body.msg).toBe("Error 404 not found!")
                    })
            })
        });








