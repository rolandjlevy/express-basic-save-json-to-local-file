const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const filename = './users.json';

if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, "[]");
}

app.get('/', (req, res) => {
  res.send(`
    <h3>Read / write demo</h3>
    <form method="post" action="/write">
    <p><input type="text" name="name" value="" /><button type="submit">write</button></p>
    </form>
    <p><a href="/view">View records</a> | <a href="/data">View raw data</a></p>
  `);
});

app.post('/write', (req, res) => {
  const { name } = req.body;
  const dataToAppend = { name };
  const fileContents = fs.readFileSync(filename);
  const data = JSON.parse(fileContents);
  data.push(dataToAppend);
  // Use this instead, with async await 
  // fs.writeFileSync(filename, JSON.stringify(data), {encoding: "utf8"});
  fs.writeFile(
    filename, 
    JSON.stringify(data), 
    "utf8",
    function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('Success');
    }
  );
});

app.get('/view', (req, res) => {
  const fileContents = fs.readFileSync(filename);
  const users = JSON.parse(fileContents);
  let output = '<ul>';
  users.forEach(item => { output += `<li>Name: ${item.name}</li>`; });
  output += '</ul>';
  res.send(`
    <h3>Read / write demo</h3>
    <p>View records:</p>
    ${output}
    <p><a href="/">← Home</a></p>
  `);
});

app.get('/data', (req, res) => {
  const fileContents = fs.readFileSync(filename);
  const users = JSON.parse(fileContents);
  res.send(`
    <h3>Read / write demo</h3>
    <p>View raw data</p>
    <pre>
      ${JSON.stringify(users, null, 2)}
    </pre>
    <p><a href="/">← Home</a></p>
  `);
});

app.listen(port, () => {
  console.log('Listening on port', port)
});