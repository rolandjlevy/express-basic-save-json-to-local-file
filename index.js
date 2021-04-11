const express = require('express');
const app = express();
const dateFormat = require('dateformat');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'))

const port = process.env.PORT || 3000;

const Users = require('./src/Users.js');
const users = new Users();

app.get('/', (req, res) => {
  res.render('pages/index');
});

// view email list
app.get('/view', (req, res) => {
  res.render('pages/view-list', { users:users.getData(), dateFormat });
});

// Add new user
app.post('/add', async (req, res, next) => {
  try {
    const name = req.body.name;
    await users.add(req.body);
    res.render('pages/success', { message:'added', name });
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
  // render error page
  res.status(error.statusCode);
  res.render('pages/error', { error: error.toString() })
});

app.listen(port, () => console.log('Listening on port', port));