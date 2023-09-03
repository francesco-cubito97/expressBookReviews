const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let authUser = users.filter((user) => user.username === username && 
                                          user.password === password)
    if(authUser.length > 0) return true;
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, "access", {expiresIn : 60 * 60});

        req.session.authorization = {
            accessToken, username
        }

        res.status(200).send("User successfully logged in!");
    }
    res.status(208).json({message: "Invalid login. Please provide valid username and password"})
  }
  else return res.status(404).json({ message: "Error in login! Provide username and password"})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Find the book with ISBN code
  let isbn = req.params.isbn;
  let bookToUpdate = books[isbn] ;
  
  let review = req.query.review;
  let currentUser = req.session.authorization.username;

  if(bookToUpdate) {
    // If exists a review done by the
    // user logged in, modify existent one
    bookToUpdate["reviews"][currentUser] = review;
    books[isbn] = bookToUpdate;
  }
  else res.status(404).json({message: "Book with ISBN " + isbn + " not found"});

  return res.status(200).json({ message: "Review '"+ review +"' correctly added on book with ISBN " + isbn });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Find the book with ISBN code
  let isbn = req.params.isbn;
  let bookToDelete = books[isbn] ;

  let currentUser = req.session.authorization.username;

  if(bookToDelete) {
    // If exists a review done by the
    // user logged in, modify existent one
    delete bookToDelete["reviews"][currentUser];
    books[isbn] = bookToDelete;
  }
  else res.status(404).json({message: "Book with ISBN " + isbn + " not found"});

  return res.status(200).json({ message: "Review done by " + currentUser + " correctly removed on book with ISBN " + isbn });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
