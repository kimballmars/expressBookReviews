const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (users.find(user => user.username === username)) {
            res.send("username already existed");
        } else {
            users.push({"username":username, "password":password});
            res.send('registration successful!')
        }
    } else {
        res.send("error, username or password not valid");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books,null,4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    let thisbook;
    for (let key in books) {
        if (books[key].isbn === isbn) {
            thisbook = books[key];
        }
    }
    
    res.send(JSON.stringify(thisbook,null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    let thosebooks = {};
    let curNum = 1;
    for (let keys in books) {
        if (books[keys].author === author) {
            thosebooks[curNum] = books[keys];
            curNum += 1;
        }
    }
    res.send(JSON.stringify(thosebooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;

    for (let keys in books) {
        if (books[keys].title === title) {
            res.send(books[keys]);
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  for (let keys in books) {
    if (books[keys].isbn === isbn) {
        res.send(books[keys].reviews)
    }
  }
});

module.exports.general = public_users;
