const express = require('express');
const app = express();
const dateFormat = require('dateformat');
const { check, body, validationResult } = require('express-validator');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

const Users = require('./src/Users.js');
const users = new Users();

// middleware to capture current url
app.use((req, res, next) =>  {
  res.locals.url = req.originalUrl;
  next();
});

// home page
app.get('/', (req, res) => {
  res.render('pages/index', { url:res.locals.url });
});

// add a new user
app.get('/inquiry', (req, res) => {
  res.render('pages/inquiry', { url:res.locals.url });
});

// view full list of users
app.get('/view-inquiries', (req, res) => {
  res.render('pages/view-inquiries', { 
    url:res.locals.url, 
    users:users.getData(), 
    dateFormat 
  });
});

// Validation / sanitization settings for user input
const validation = [
  check('name').not().isEmpty().trim().escape().isLength({ min:3, max:64 }),
  check('email').not().isEmpty().trim().isEmail().isLength({ max:64 }),
  check('message').not().isEmpty().trim().escape().isLength({ min:3, max:512 })
];

// Posted data for adding new user
app.post('/inquiry-form', validation, async (req, res, next) => {
  try {
    // validationResult extracts validation errors from request and makes them available in a Result object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(`Invalid input. Your name and message must be at least 3 characters and you must provide a valid email address.`);
      error.statusCode = 422; // Unprocessable Entity
      next(error);
    }
    await users.add(req.body);
    res.render('pages/success', { message:'added', name: req.body.name });
  } catch(err) {
    next(err);
  }
});

// delete one record
app.get('/delete', async (req, res, next) => {
  try {
    const { id, name } = req.query;
    await users.delete(Number(id));
    res.render('pages/success', { message:'deleted', name });
  } catch(err) {
    next(err);
  }
});

/*////////////////*/
/* Error handling */
/*////////////////*/

// page not found
app.get('/not-found', (req, res) => {
  res.status(404);
  res.render('pages/not-found');
});

// wildcard route throws not found error
app.get('*', (req, res, next) => {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);
  error.statusCode = 301;
  next(error);
});

// middleware for handing errors
app.use((error, req, res, next) => {
  // if status code not defined set to generic HTTP status code (500)
  if (!error.statusCode) error.statusCode = 500;
  // redirect if route is not found
  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }
  console.log('middleware')
  // render error page
  res.status(error.statusCode);
  res.render('pages/error', { error: error.toString() })
});

app.listen(port, () => console.log('Listening on port', port));