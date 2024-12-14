const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    if (users.find(user => user.username === username)) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    if (users.find(user => {return (user.username === username && user.password === password)})) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
// Login endpoint
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const thisUsername = req.session.authorization.username; // Logged-in username
    const thisReview = req.body.review; // Review text
    const isbn = req.params.isbn; // Book ISBN

    let bookFound = false;

    // Loop through the books to find the matching ISBN
    for (let key in books) {
        if (books[key].isbn === isbn) {
            bookFound = true;

            // Add or update the review using the username as a key
            books[key].reviews[thisUsername] = thisReview;

            return res.status(200).json({
                message: "Review added or updated successfully.",
                reviews: books[key].reviews
            });
        }
    }

    // If the book is not found
    if (!bookFound) {
        return res.status(404).json({ message: "Book not found." });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    for (let keys in books) {
        if (books[keys].isbn === isbn) {
            delete books[keys].isbn[username];
            res.send("delete successfully");
        }
    }
    res.send("cannot find the isbn");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
