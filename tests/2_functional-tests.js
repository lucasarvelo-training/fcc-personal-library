/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */
const Book = require('../models/book.js');
var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  afterEach(done => {
    Book.deleteMany({ title: 'test' }, err => {
      done();
    });
  });
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function(done) {
    const book = new Book({ title: 'test' });
    book.save((error, book) => {
      if (error) return console.log(error.message);
      chai
        .request(server)
        .get('/api/books')
        .end(function(error, res) {
          if (error) return console.log(error);
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(
            res.body[0],
            'commentcount',
            'Books in array should contain commentcount'
          );
          assert.property(
            res.body[0],
            'title',
            'Books in array should contain title'
          );
          assert.property(
            res.body[0],
            '_id',
            'Books in array should contain _id'
          );
          done();
        });
    });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function() {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function() {
        test('Test POST /api/books with title', function(done) {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: 'test' })
            .end(function(error, res) {
              if (error) return console.log(error);
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                '_id',
                'Books in array should contain _id'
              );
              assert.property(
                res.body,
                'title',
                'Books in array should contain title'
              );
              assert.property(
                res.body,
                '_id',
                'Books in array should contain _id'
              );
              done();
            });
        });

        test('Test POST /api/books with no title given', function(done) {
          chai
            .request(server)
            .post('/api/books')
            .send({})
            .end(function(error, res) {
              if (error) return console.log(error);
              assert.equal(res.status, 400);
              assert.property(
                res.body,
                'error',
                'Response should contain an error'
              );
              assert.equal(
                res.body.error,
                'Book validation failed: title: Path `title` is required.'
              );
              done();
            });
        });
      }
    );

    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books', function(done) {
        const book = new Book({ title: 'test' });
        book.save((error, book) => {
          if (error) return console.log(error.message);

          chai
            .request(server)
            .get('/api/books')
            .end(function(error, res) {
              if (error) return console.log(error);

              assert.equal(res.status, 200);
              assert.isArray(res.body, 'response should be an array');
              assert.property(
                res.body[0],
                'commentcount',
                'Books in array should contain commentcount'
              );
              assert.property(
                res.body[0],
                'title',
                'Books in array should contain title'
              );
              assert.property(
                res.body[0],
                '_id',
                'Books in array should contain _id'
              );
              done();
            });
        });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {
      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .get('/api/books/5dfc06579ec0715880e8614f')
          .end(function(error, res) {
            if (error) return console.log(error);
            assert.equal(res.status, 400);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        const book = new Book({ title: 'test' });
        book.save((error, book) => {
          if (error) return console.log(error.message);
          chai
            .request(server)
            .get('/api/books/' + book._id)
            .end(function(error, res) {
              if (error) return console.log(error);
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                'commentcount',
                'Books in array should contain commentcount'
              );
              assert.property(
                res.body,
                'title',
                'Books in array should contain title'
              );
              assert.property(
                res.body,
                '_id',
                'Books in array should contain _id'
              );
              done();
            });
        });
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function() {
        test('Test POST /api/books/[id] with comment', function(done) {
          const book = new Book({ title: 'test' });
          book.save((error, book) => {
            if (error) return console.log(error.message);

            chai
              .request(server)
              .post('/api/books/' + book._id)
              .send({ comment: 'test' })
              .end(function(error, res) {
                if (error) return console.log(error);
                assert.equal(res.status, 200);
                assert.property(
                  res.body,
                  'commentcount',
                  'Books in array should contain commentcount'
                );
                assert.property(
                  res.body,
                  'title',
                  'Books in array should contain title'
                );
                assert.property(
                  res.body,
                  '_id',
                  'Books in array should contain _id'
                );
                assert.equal(res.body.comments[0], 'test');
                done();
              });
          });
        });
      }
    );
  });
});
