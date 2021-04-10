const express = require('express');
const app = express();
const fs = require("fs");
const { promisify } = require('util'); // transforms callbacks into promises
const dateFormat = require('dateformat');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const filename = './' + process.env.FILENAME;
const port = process.env.PORT || 3000;

const Users = require('./Users.js');
const users = new Users();

// const getData = () => {
//   try {
//     const fileContents = fs.readFileSync(filename);
//     const data = JSON.parse(fileContents);
//     return data.sort((a, b) => new Date(b.added) - new Date(a.added));
//   } catch(err) {
//     console.log(err);
//   }
// };

// const saveUsers = async (data) => {
//   try {
//     await fs.writeFileSync(filename, JSON.stringify(data));
//   } catch(err) {
//     console.log(err);
//   }
// }

// const getLastId = () => {
//   return getData().reduce((acc, item) => {
//     if (Number(item.id) > acc) acc = item.id;
//     return acc;
//   }, 0);
// }

// let counter;

// const init = () => {
//   if (fs.existsSync(filename)) {
//     counter = getLastId();
//   } else {
//     saveUsers([]);
//     counter = 0;
//   }
// }
// init();

app.get('/', (req, res) => {
  res.status(200).send(`
    <nav><a href="/">Home</a> | <a href="/view">View records</a></nav>
    <h3>Subscribe to our Newsletter 📝</h3>
    <form method="post" action="/add">
    <ul>
      <li><label for="name">👨‍💼 Name</label> <input type="text"  id="name" name="name" value="Roland Levy" placeholder="Your name..."  required /></li>
      <li><label for="email">📧 Email</label> <input type="email" id="email" name="email" value="rolandjlevy@gmail.com" placeholder="Your email..." required /></li>
      <li><label for="message">💬 Message</label> <textarea id="message" name="message" placeholder="Your message..." required>Hello world</textarea></li>
      <li><label for="subscribe">🔔 Subscribe</label> <input type="checkbox" id="subscribe" name="subscribe" /></li>
    </ul>
    <input type="submit" value="Submit">
    </form>
  `);
});

// Add new user
app.post('/add', async (req, res) => {
  users.add(req.body);
});

// view all user records
app.get('/view', (req, res) => {
  res.status(200).send(`
    <h3>Subscribe to our Newsletter 📝</h3>
    <p>View records:</p>
    ${getUserRecords()}
    <p><a href="/">← Home</a></p>
  `);
});

// delete one record
app.get('/delete', (req, res, next) => {
  const id = Number(req.query.id);
  const userExists = users.getData().find(item => item.id === id);
  if (!userExists) {
    const error = new Error(`Record with ID '${id}' does not exist`);
    next(error);
  }
  const updatedUsers = users.getData().filter(item => item.id !== id);
  users.saveUsers(updatedUsers);
  res.status(200).redirect('/view');
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

/*////////////////*/
/* Error handling */
/*////////////////*/

// page not found
app.get('/not-found', (req, res) => {
  // res.render('pageNotFound.ejs')
  res.status(200).send('Page not found');
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