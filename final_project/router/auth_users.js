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
      .status(300)
      .json({ message: "Please enter valid username and password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
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

    return res.status(300).json({ message: "Logged in Successfully!" });
  } else {
    return res.status(300).json({ message: "User not found" });
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
