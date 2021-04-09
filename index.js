const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h3>Read / write demo</h3>
    <form method="post" action="/write">
    <p><input type="text" name="name" value="" /><button type="submit">write</button></p>
    </form>
    <p><a href="/write">Write file</a> | <a href="/read">Read file</a></p>
  `);
});

app.post('/write', (req, res) => {
  const { name } = req.body;
  const input = [
    {
      name: name
    }
  ]
  fs.writeFile(
    "filename.json", 
    JSON.stringify(input), 
    "utf8", 
    function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('Success');
    }
  );
});

app.get('/read', (req, res) => {
  const output = require("./filename.json");
  console.log({output})
});

app.listen(port, () => {
  console.log('Listening on port', port)
});