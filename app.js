//______________________________________________________________________________________________________________

//
require('dotenv').config()

// Express set-up
const express = require('express')
const app = express()

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log(`Secrets app listening on port ${port}`)
})

app.use(express.urlencoded({
  extended: true
}))

app.use(express.static('public'))

//______________________________________________________________________________________________________________

// EJS set-up
let ejs = require('ejs');

app.set('view engine', 'ejs');

//______________________________________________________________________________________________________________

// Lodash set-up
var _ = require('lodash');

//______________________________________________________________________________________________________________

// Mongoose set-up
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Mongoose-encryption set-up JUST BEFORE MODEL
var encrypt = require('mongoose-encryption');

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password']
});

const User = mongoose.model('User', userSchema);

//______________________________________________________________________________________________________________

// Display Home
app.get('/', (req, res) => {
  res.render('home')
})

// Display Login
app.get('/login', (req, res) => {
  res.render('login')
})

// Display Register
app.get('/register', (req, res) => {
  res.render('register')
})

// Display Secrets after registration
app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function(err) {
    if (!err) {
      res.render('secrets')
    } else {
      console.log(err);
    }
  })
})

// Display Secrets after login
app.post('/login', (req, res) => {
  User.findOne({
    email: req.body.username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render('secrets')
        }
      }
    }
  });
})
