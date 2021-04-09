const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const filename = './users.json';

const getLastId = () => {
  return getExistingData().reduce((acc, item) => {
    if (Number(item.id) > acc) acc = item.id;
    return acc;
  }, 0);
}

const getExistingData = () => {
  const fileContents = fs.readFileSync(filename);
  return JSON.parse(fileContents);
}

const deleteUser = (id) => {
  const users = getExistingData();
  const updatedUsers = users.filter(item => item.id !== id);
  (async () => {
    await fs.writeFileSync(filename, JSON.stringify(updatedUsers));
    console.log('Deleted');
  })();
}

// express.use( function( req, res, next ) {
//   next();
//   console.log( "world" );
// });
// express.get( "/", function( req, res ) {
//   res.send( "hello" );
// });

// async function writeToFile() {
//   await fs.promises.writeFile(__dirname + '/test-22.json', "data", {
//     encoding: 'utf8'
//   });
//   console.log("done")
// }
// writeToFile()

let counter;

if (fs.existsSync(filename)) {
  counter = getLastId();
} else {
  fs.writeFileSync(filename, "[]");
  counter = 0;
}

app.get('/', (req, res) => {
  res.send(`
    <h3>Add user demo</h3>
    <form method="post" action="/add">
    <ul>
      <li><label for="name">Name</label> <input type="text"  id="name" name="name" value="" placeholder="Your name..."  required /></li>
      <li><label for="email">Email</label> <input type="email" id="email" name="email" value="" placeholder="Your email..." required /></li>
    </ul>
    <input type="submit" value="Add user">
    </form>
    <p><a href="/view">View records</a> | <a href="/json">View json data</a></p>
  `);
});

app.post('/add', (req, res) => {
  const { name, email } = req.body;
  const userData = { 
    id: ++counter, 
    name, 
    email
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
  res.send(`
    <h3>Add user demo</h3>
    <p>View records:</p>
    ${output}
    <p><a href="/">← Home</a></p>
  `);
});

const getRecords = (users) => {
  let output = `
  <table border="1">
    <thead>
      <tr>
        <th>Name</th><th>Email</th><th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>`;
  users.forEach(item => { 
    output += `<tr>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td><a href="/delete?id=${item.id}">Delete</a></td>
    </tr>`; 
  });
  output += '</tbody></table>';
  return output;
}

app.get('/json', (req, res) => {
  const users = getExistingData();
  res.send(`
    <h3>Add user demo</h3>
    <p>View json data:</p>
    <pre>
      ${JSON.stringify(users, null, 2)}
    </pre>
    <p><a href="/">← Home</a></p>
  `);
});

app.get('/delete', (req, res) => {
  const id = Number(req.query.id);
  deleteUser(id);
});

app.listen(port, () => {
  console.log('Listening on port', port)
});