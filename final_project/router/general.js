const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (Object.keys(books).length > 0) {
    const allBooks = JSON.stringify(books);
    return res.status(300).json(allBooks);
  } else {
    return res.status(300).json({ message: "Book not found" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbns = Object.keys(books);
  if (isbns.includes(req.params.isbn)) {
    const book = JSON.stringify(books[req.params.isbn]);
    return res.status(300).json(book);
  } else {
    return res.status(300).json({ message: "Book Not Found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  const keys = Object.entries(books);

  const authorSpecificBooks = keys.filter(([key, book]) => {
    return book.author.toLocaleLowerCase() === author.toLocaleLowerCase();
  });

  if (authorSpecificBooks.length > 0) {
    const data = JSON.stringify(authorSpecificBooks);
    return res.status(300).json(data);
  } else {
    return res.status(300).json({ message: "Author Not Found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
