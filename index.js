const express = require('express');
const app = express();
const dateFormat = require('dateformat'); // date formatter
const he = require('he'); // HTML entity encoder / decoder
const { check, validationResult } = require('express-validator'); // user input validator / sanitizer
require('dotenv').config();

app.use(express.urlencoded({ extended: true })); // middleware parses urlencoded bodies of any type

app.set('view engine', 'ejs'); // set ejs as the template engine
app.use(express.static(__dirname + '/public'));

const { RECAPTCHA_SITE_KEY, SECRET } = process.env;

const Users = require('./src/Users.js'); 
const users = new Users();

// middleware to capture current url for nav links
app.use((req, res, next) =>  {
  res.locals.url = req.originalUrl;
  next();
});

// home page
app.get('/', (req, res) => {
  res.render('pages/index', { url:res.locals.url });
});

// submit an inquiry page
app.get('/inquiry', (req, res) => {
  res.render('pages/inquiry', { url:res.locals.url, recaptchaSiteKey: RECAPTCHA_SITE_KEY });
});

// access inquiries page
app.get('/view-inquiries', (req, res) => {
  res.render('pages/view-inquiries');
});

// view full list of inquiries
app.post('/view-inquiries-page', (req, res, next) => {
  if (req.body.secret !== SECRET) {
    const err = new Error('Current secret is Invalid');
    err.statusCode = 403;
    next(err);
  }
  res.render('pages/view-inquiries-page', { 
    url:res.locals.url, 
    users:users.getData(), 
    dateFormat,
    he
  });
});

// express-validator: validation / sanitization settings for user input
const validation = [
  check('name').not().isEmpty().trim().escape().isLength({ min:3, max:128 }),
  check('email').not().isEmpty().trim().isEmail().isLength({ max:128 }),
  check('message').not().isEmpty().trim().escape().isLength({ min:3, max:512 })
];

// Posted data for adding new inquiry
app.post('/inquiry-form', validation, (req, res, next) => {
  try {
    // validationResult makes errors available to result object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(`Invalid input. Your name and message must be at least 3 characters and you must provide a valid email address.`);
      error.statusCode = 422; // Unprocessable Entity
      next(error);
      return;
    }
    if (!req.body['g-recaptcha-response']) {
      const error = new Error(`Invalid recaptcha. You cannot submit your inquiry unless you confirm that you are NOT a robot... 🤖`);
      error.statusCode = 422; // Unprocessable Entity
      next(error);
      return;
    }
    users.add(req.body);    
    const name = he.decode(req.body.name);
    res.render('pages/success', { message:' - thank you, your inquiry has been sent.', name });
    return;
  } catch(error) {
    next(error);
  }
});

// delete one inquiry
app.get('/delete', (req, res, next) => {
  try {
    const { uuid, name } = req.query;
    const currentName = users.getValueById(uuid, 'name') || '';
    users.delete(uuid);
    res.render('pages/success', { message:'has been deleted from the records.', name:he.decode(currentName)});
    return;
  } catch(err) {
    next(err);
  }
});

/*////////////////*/
/* Error handling */
/*////////////////*/

// page not found (404)
app.get('/not-found', (req, res) => {
  res.status(404);
  res.render('pages/not-found');
});

// wildcard route throws 302 error (temporary redirect)
app.get('*', (req, res, next) => {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);
  error.statusCode = 302;
  next(error);
});

// middleware for handing errors
app.use((error, req, res, next) => {
  // if status code not defined set to generic HTTP status code (500)
  if (!error.statusCode) error.statusCode = 500;
  // redirect if route is not found
  if (error.statusCode === 302) {
    return res.status(302).redirect('/not-found');
  }
  // render error page
  res.status(error.statusCode);
  res.render('pages/error', { error:error.toString() })
});

module.exports = app; // export module so server.js can import app to listen for requests and testing libraries can also have access to app without listening to requests on the same port