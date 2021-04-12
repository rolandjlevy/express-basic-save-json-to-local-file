const request = require("supertest");
const app = require('../index');

describe("GET endpoints", () => {
  
  test("Root endpoint response with statusCode 200", () => {
    return request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test("/delete endpoint response for req.query", () => {
    return request(app)
      .get('/delete')
      .query( {
        id: '55'
      })
      .then(response => {
        expect(response.statusCode).toBe(500);
      });
  });

});

describe('POST endpoints', () => {
  it('response with invalid input', () => {
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