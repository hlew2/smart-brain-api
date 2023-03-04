const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL,
    ssl: true
  }
});

const saltRounds = 10;

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt, saltRounds);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db)
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db)
});


app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res)
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
