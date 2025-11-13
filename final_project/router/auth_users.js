const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const existingUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (existingUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "Please enter valid username and password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: username,
      },
      "fingerprint_customer",
      {
        expiresIn: 60 * 60,
      }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    return res
      .status(200)
      .json({ message: "Logged in Successfully!", username });
  } else {
    return res.status(400).json({ message: "User not found" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;

  let username = req.session.authorization.username;

  if (!username) {
    return res.status(300).json({ message: "User not logged in!" });
  } else {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully", book });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  if (!isbn) {
    return res.status(300).json({ message: "Please enter valid ISBN number" });
  }
  let username = req.session.authorization.username;
  if (!username) {
    return res.status.json({ message: "User not logged in" });
  }
  let book = books[isbn];
  if (!book) {
    return res
      .status(300)
      .json({ message: "No Book associated with this ISBN number " });
  } else {
    if (book.reviews && book.reviews[username]) {
      delete book.reviews[username];

      return res.status(300).json({ message: "review deleted!", book });
    } else {
      return res
        .status(300)
        .json({ message: "No review associated with this user!" });
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
