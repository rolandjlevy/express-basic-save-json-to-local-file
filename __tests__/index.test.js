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
  // test("/delete endpoint response for req.query", () => {
  //   return request(app)
  //     .get('/delete')
  //     .query({ id: 1 })
  //     .expect(200, (err, res) => {
  //       res.text.should.be.equal(1);
  //     });
  // });
});

describe('POST endpoints', function() {
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