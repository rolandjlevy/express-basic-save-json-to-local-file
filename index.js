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
  // res.status(200).send(`
  //   <nav><a href="/">Home</a> | <a href="/view">View records</a></nav>
  //   <h3>Subscribe to our Newsletter 📝</h3>
  //   <form method="post" action="/add">
  //   <ul>
  //     <li><label for="name">👨‍💼 Name</label> <input type="text"  id="name" name="name" value="Roland Levy" placeholder="Your name..."  required /></li>
  //     <li><label for="email">📧 Email</label> <input type="email" id="email" name="email" value="rolandjlevy@gmail.com" placeholder="Your email..." required /></li>
  //     <li><label for="message">💬 Message</label> <textarea id="message" name="message" placeholder="Your message..." required>Hello world</textarea></li>
  //     <li><label for="subscribe">🔔 Subscribe</label> <input type="checkbox" id="subscribe" name="subscribe" /></li>
  //   </ul>
  //   <input type="submit" value="Submit">
  //   </form>
  // `);
});

// view all user records
app.get('/view', (req, res) => {
  res.status(200).send(`
    <nav><a href="/">Home</a> | <a href="/view">View records</a></nav>
    <h3>View email records 📧</h3>
    ${getUserRecords()}
  `);
});

// Add new user
app.post('/add', async (req, res, next) => {
  try {
    await users.add(req.body);
    res.status(200).redirect('/success?message=added');
  } catch(err) {
    next(err);
  }
});

// delete one record
app.get('/delete', async (req, res, next) => {
  try {
    const id = Number(req.query.id);
    await users.delete(id);
    res.status(200).redirect('/success?message=deleted');
  } catch(err) {
    next(err);
  }
});

const getUserRecords = () => {
  let output = `
  <table border="1">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Message</th>
        <th>Subscribed?</th>
        <th>Date / Time added</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>`;
  users.getData().forEach(item => {
    const date = new Date(item.added);
    output += `<tr>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.message}</td>
      <td>${item.subscribe}</td>
      <td>${dateFormat(date, 'GMT:dd/mm/yyyy, h:MM:ss TT')}</td>
      <td><a href="/delete?id=${item.id}">Delete</a></td>
    </tr>`;
  });
  output += '</tbody></table>';
  return output;
}

// Display success message
app.get('/success', (req, res) => {
  const { message } = req.query;
  res.status(200).send(`
    <nav><a href="/">Home</a> | <a href="/view">View records</a></nav>
    <h3>Success ⚠️</h3>
    <p>User ${message}</p>
  `)
});

/*////////////////*/
/* Error handling */
/*////////////////*/

// page not found
app.get('/not-found', (req, res) => {
  res.status(200).send('Page not found'); // res.render('pageNotFound.ejs')
});

// error page
app.get('/error', (req, res) => {
  // res.render('errorPage.ejs')
  res.status(200).send('Error');
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
  // render error message
  return res.status(error.statusCode).json({ message: error.toString() });
  // res.render('errorPage.ejs', { error: error.toString() }) 
});

app.listen(port, () => console.log('Listening on port', port));