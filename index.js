const express = require('express');
const app = express();
const fs = require("fs");
const dateFormat = require('dateformat');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const filename = './' + process.env.FILENAME;
const port = process.env.FILENAME || 3000;

const getExistingData = () => {
  const fileContents = fs.readFileSync(filename);
  const data = JSON.parse(fileContents);
  return data.sort((a, b) => new Date(b.added) - new Date(a.added));
};

const getLastId = () => {
  return getExistingData().reduce((acc, item) => {
    if (Number(item.id) > acc) acc = item.id;
    return acc;
  }, 0);
}

const deleteUser = (id) => {
  const users = getExistingData();
  const updatedUsers = users.filter(item => item.id !== id);
  (async () => {
    await fs.writeFileSync(filename, JSON.stringify(updatedUsers));
    console.log('Deleted');
  })();
}

let counter;

if (fs.existsSync(filename)) {
  counter = getLastId();
} else {
  fs.writeFileSync(filename, "[]");
  counter = 0;
}

app.get('/', (req, res) => {
  res.status(200).send(`
    <h3>Add user demo</h3>
    <form method="post" action="/add">
    <ul>
      <li><label for="name">Name</label> <input type="text"  id="name" name="name" value="" placeholder="Your name..."  required /></li>
      <li><label for="email">Email</label> <input type="email" id="email" name="email" value="" placeholder="Your email..." required /></li>
      <li><label for="message">Message</label> <textarea id="message" name="message" value="" placeholder="Your message..." required /></textarea></li>
      <li><label for="subscribe">Subscribe</label> <input type="checkbox" id="subscribe" name="subscribe" /></li>
    </ul>
    <input type="submit" value="Add user">
    </form>
    <p><a href="/view">View records</a> | <a href="/json">View json data</a></p>
  `);
});

app.post('/add', (req, res) => {
  const { name, email, message, subscribe } = req.body;
  const userData = { 
    id: ++counter, 
    name, 
    email,
    message,
    subscribe: subscribe ? '✅' : '',
    added: new Date()
  };
  const existingData = getExistingData()
  existingData.push(userData);
  // Use this instead, with async await 
  // fs.writeFileSync(filename, JSON.stringify(data), {encoding: "utf8"});
  fs.writeFile(
    filename, 
    JSON.stringify(existingData), 
    "utf8",
    function(err) {
      if (err) return console.log(err);
      console.log('Success');
    }
  );
});

app.get('/view', (req, res) => {
  const users = getExistingData();
  const output = getRecords(users);
  res.status(200).send(`
    <h3>Add user demo</h3>
    <p>View records:</p>
    ${output}
    <p><a href="/">← Home</a> | <a href="/view">Refresh</a></p>
  `);
});

app.get('/delete', (req, res) => {
  const id = Number(req.query.id);
  deleteUser(id);
});

const getRecords = (users) => {
  let output = `
  <table border="1">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Message</th>
        <th>Subscribed?</th>
        <th>Date added</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>`;
  users.forEach(item => {
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

app.get('/json', (req, res) => {
  const users = getExistingData();
  res.status(200).send(`
    <h3>Add user demo</h3>
    <p>View json data:</p>
    <pre>
      ${JSON.stringify(users, null, 2)}
    </pre>
    <p><a href="/">← Home</a></p>
  `);
});

app.listen(port, () => {
  console.log('Listening on port', port)
});