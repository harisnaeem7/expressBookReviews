const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const existingUser = (username, password) => {
  const checkUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (checkUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "Please enter valid Username and Password!" });
  }

  if (!existingUser(username, password)) {
    users.push({
      username: username,
      password: password,
    });
    return res.status(200).json({ message: "User registered successfully!" });
  } else {
    return res.status(200).json({ message: "User already exist!" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (Object.keys(books).length > 0) {
    const allBooks = JSON.stringify({ books }, null, 4);
    return res.status(200).send(allBooks);
  } else {
    return res.status(404).json({ message: "Books not found" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({ message: "Please provide valid isbn" });
  }
  const book = JSON.stringify(books[isbn], null, 2);
  if (!book) {
    return res.status(404).json({ message: "No Book found for this ISBN" });
  }
  return res.status(200).send(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;

  const authorSpecificBooks = Object.values(books).filter((book) => {
    return book.author.toLocaleLowerCase() === author.toLocaleLowerCase();
  });

  if (authorSpecificBooks.length > 0) {
    const data = JSON.stringify(authorSpecificBooks, null, 2);
    return res.status(200).send(data);
  } else {
    return res.status(400).json({ message: "Author Not Found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;

  const titleBasedBook = Object.values(books).filter((book) => {
    return book.title.toLocaleLowerCase() === title.toLocaleLowerCase();
  });

  if (titleBasedBook.length > 0) {
    const data = JSON.stringify(titleBasedBook, null, 2);
    return res.status(200).send(data);
  } else {
    return res
      .status(400)
      .json({ message: "Book with This Title does not exist." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({ message: "Please enter a valid ISBN" });
  }
  let reviewsBooks = books[isbn];
  if (!reviewsBooks) {
    return res.status(404).json({ message: "Book not found with this ISBN" });
  }

  return res.status(200).json(reviewsBooks.reviews);
});

module.exports.general = public_users;
