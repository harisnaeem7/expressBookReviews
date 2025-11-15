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
  // if (Object.keys(books).length > 0) {
  //   const allBooks = JSON.stringify({ books }, null, 4);
  //   return res.status(200).send(allBooks);
  // } else {
  //   return res.status(404).json({ message: "Books not found" });
  // }

  //Code for task 10 using Promises

  const getBooks = new Promise((resolve, reject) => {
    if (Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject("No Books Found");
    }
  });

  getBooks
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  // let isbn = req.params.isbn;
  // if (!isbn) {
  //   return res.status(400).json({ message: "Please provide valid isbn" });
  // }
  // const book = JSON.stringify(books[isbn], null, 2);
  // if (!book) {
  //   return res.status(404).json({ message: "No Book found for this ISBN" });
  // }
  // return res.status(200).send(book);
  try {
    const isbn = req.params.isbn;

    if (!isbn) {
      return res.status(400).json({ message: "Please provide valid isbn" });
    }

    const getBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book Not Foud");
      }
    });

    const book = await getBook;

    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  // let author = req.params.author;

  // const authorSpecificBooks = Object.values(books).filter((book) => {
  //   return book.author.toLowerCase() === author.toLowerCase();
  // });

  // if (authorSpecificBooks.length > 0) {
  //   const data = JSON.stringify(authorSpecificBooks, null, 2);
  //   return res.status(200).send(data);
  // } else {
  //   return res.status(400).json({ message: "Author Not Found" });
  // }
  try {
    let author = req.params.author;
    const authorSpecificBook = new Promise((resolve, reject) => {
      const book = Object.values(books).filter((book) => {
        return book.author.toLowerCase() === author.toLowerCase();
      });

      if (book.length > 0) {
        resolve(book);
      } else {
        reject("Book not found for this Author!");
      }
    });

    const newBook = await authorSpecificBook;

    return res.status(200).json(newBook);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  // let title = req.params.title;

  // const titleBasedBook = Object.values(books).filter((book) => {
  //   return book.title.toLowerCase() === title.toLowerCase();
  // });

  // if (titleBasedBook.length > 0) {
  //   const data = JSON.stringify(titleBasedBook, null, 2);
  //   return res.status(200).send(data);
  // } else {
  //   return res
  //     .status(400)
  //     .json({ message: "Book with This Title does not exist." });
  // }

  try {
    let title = req.params.title;
    const getbookByTitle = new Promise((resolve, reject) => {
      const book = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase()
      );

      if (book.length > 0) {
        resolve(book);
      } else {
        reject("Book not found for specific title");
      }
    });

    const newBook = await getbookByTitle;

    return res.status(200).json(newBook);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({ message: "Please enter a valid  ISBN" });
  }
  let reviewsBooks = books[isbn];
  if (!reviewsBooks) {
    return res
      .status(404)
      .json({ message: "Book not found with this specific ISBN" });
  }

  return res.status(200).json(reviewsBooks.reviews);
});

module.exports.general = public_users;
