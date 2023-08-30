const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  let book = books[isbn];

  if(book)
    return res.send(book);
  else
    return res.status(404).json({ message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  let author = req.params.author;
  let booksFound = [];

  let keys = Object.keys(books);

  for(let k in keys) {
      
      if(books[keys[k]]["author"] == author) booksFound.push(books[keys[k]]);
  }

  if(booksFound.length > 0) return res.send(booksFound);
  else
    return res.status(404).json({ message: "Book with author " + author + " not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    let title = req.params.title;
    let booksFound = [];
  
    let keys = Object.keys(books);
    
    for(let k in keys) {
        if(books[keys[k]]["title"] == title) booksFound.push(books[keys[k]]);
    }
  
    if(booksFound.length > 0) return res.send(booksFound);
    else
      return res.status(404).json({ message: "Book with title " + title + " not found"});
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
