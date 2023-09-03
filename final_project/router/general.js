const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        // If the user is new add it to users
        if(users.filter((user) => user.username === username).length === 0) {
            users.push({"username": username, 
                        "password": password});
            return res.status(200).json({message: "User " + username + " successfully registred!"});
        }

        return res.status(404).json({message: "User already registered!"}); 
    }

    return res.status(404).json({message: "Unable to register user. Please provide a username and a password"});
});


let getAllBooks = new Promise((resolve, reject) => {
    let myBooks = books;
    if(myBooks)
        resolve(myBooks);
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  getAllBooks.then((booksFound) => {
    return res.send(JSON.stringify(booksFound, null, 4));
  });
});

let getBookDetailsByIsbn = function(isbn) {
    
    return new Promise((resolve, reject) => {
        let bookDetails = books[isbn];
        resolve(bookDetails);
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  getBookDetailsByIsbn(isbn).then((bookDetails) => {
    if(bookDetails)
        return res.send(bookDetails);
    else
        return res.status(404).json({ message: "Book with ISBN " + isbn + " not found"});
  });
 });

let getBookDetailsByAuthor = function(author) {
    
    return new Promise((resolve, reject) => {
        let booksFound = [];

        let keys = Object.keys(books);

        for(let k in keys) {
            
            if(books[keys[k]]["author"] === author) booksFound.push(books[keys[k]]);
        }

        resolve(booksFound);
    });
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  let author = req.params.author;
  
  getBookDetailsByAuthor(author).then((booksFound) => {
      console.log(booksFound);
    if(booksFound.length > 0) 
        return res.send(booksFound);
    else
        return res.status(404).json({ message: "Book with author " + author + " not found"});
  });

});

let getBookDetailsByTitle = function(title) {
    
    return new Promise((resolve, reject) => {
        let booksFound = [];

        let keys = Object.keys(books);

        for(let k in keys) {
            
            if(books[keys[k]]["title"] === title) booksFound.push(books[keys[k]]);
        }

        resolve(booksFound);
    });
}


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    let title = req.params.title;

    getBookDetailsByTitle(title).then((booksFound) => {
        if(booksFound.length > 0) 
            return res.send(booksFound);
        else
            return res.status(404).json({ message: "Book with title " + title + " not found"});
    }); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;

    let book = books[isbn];
  
    if(book)
      return res.send(book["reviews"]);
    else
      return res.status(404).json({ message: "Book with ISBN " + isbn + " not found"});
});

module.exports.general = public_users;
