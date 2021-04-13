// testing HTTP requests with supertest

const request = require("supertest");
const app = require('../index');

describe("GET endpoints", () => {

  test("Root endpoint with successful status (200)", () => {
    return request(app)
      .get("/")
      .then(res => {
        expect(res.statusCode).toBe(200);
      });
  });

  test("/delete endpoint response with invalid id", () => {
    return request(app)
      .get('/delete')
      .query( {
        id: 'xxx'
      })
      .then(res => {
        expect(res.statusCode).toBe(500);
      });
  });

  test("/* endpoint response with temporary redirect (302)", () => {
    return request(app)
      .get('/*')
      .then(res => {
        expect(res.statusCode).toBe(302);
      });
  });

});

describe('POST endpoints', () => {
  test('Inqiury form posted with unprocessable input (422)', () => {
    return request(app)
      .post('/inquiry-form')
      .send({
        id: 'john',
        name: 'john',
        email: 'xxx',
        message: 'Hello world',
        subscribe: ''
      })
      .set('Accept', 'application/json')
      .expect(422)
  });
});