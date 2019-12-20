/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const Book = require('../models/book.js');

module.exports = function(app) {
  app
    .route('/api/books')
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (error, books) => {
        if (error) return res.status(400).json({ error: error.message });
        return res.json(books);
      });
    })

    .post(function(req, res) {
      //response will contain new book object including atleast _id and title
      const book = new Book(req.body);
      book.save((error, book) => {
        if (error) return res.status(400).json({ error: error.message });

        return res.json(book);
      });
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, error => {
        if (error) return res.status(400).json(error.message);

        return res.json('complete delete successful');
      });
    });

  app
    .route('/api/books/:id')
    .get(function(req, res) {
      const bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookId, (error, book) => {
        if (error) return res.status(400).json({ error: error.message });

        if (!book) {
          return res.status(400).json('no book exists');
        } else {
          return res.json(book);
        }
      });
    })

    .post(function(req, res) {
      const bookId = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get
      Book.findById(bookId, (error, book) => {
        if (error) return res.status(400).json({ error: error.message });

        book.comments.push(comment);
        book.commentcount = book.comments.length;
        book.save((error, book) => {
          if (error) return res.status(400).json({ error: error.message });

          return res.json(book);
        });
      });
    })

    .delete(function(req, res) {
      const bookId = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id: bookId }, error => {
        if (error) return res.status(400).json({ error: error.message });
        return res.json('delete successful');
      });
    });
};
