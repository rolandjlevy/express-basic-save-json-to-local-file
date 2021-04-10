const fs = require("fs");
require('dotenv').config();

class Users {
  constructor() {
    this.filename = './' + process.env.FILENAME;
    this.init();
  }
  init() {
    if (fs.existsSync(this.filename)) {
      this.counter = this.getLastId();
    } else {
      this.saveUsers([]);
      this.counter = 0;
    }
  }
  getLastId() {
    return this.getData().reduce((acc, item) => {
      if (Number(item.id) > acc) acc = item.id;
      return acc;
    }, 0);
  }
  getData() {
    try {
      const fileContents = fs.readFileSync(this.filename);
      const data = JSON.parse(fileContents);
      return data.sort((a, b) => new Date(b.added) - new Date(a.added));
    } catch(err) {
      console.log(err);
    }
  }
  saveUsers(data) {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(data));
    } catch(err) {
      console.log(err);
    }
  }
  add(data) {
    const { name, email, message, subscribe } = data;
    const user = {
      id: ++this.counter, 
      name, 
      email,
      message,
      subscribe: subscribe ? '✅' : '',
      added: new Date()
    };
    const existingData = [ ...this.getData(), user];
    this.saveUsers(existingData);
  }
}

module.exports = Users;