const fs = require("fs");
require('dotenv').config();
const { promisify } = require('util'); // transforms callbacks into promises

class Users {
  constructor() {
    this.filename = './' + process.env.FILENAME;
    this.init();
  }
  init() {
    if (fs.existsSync(this.filename)) {
      this.counter = this.getLastId();
    } else {
      this.saveData([]);
      this.counter = 0;
    }
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
  saveData(data) {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(data));
    } catch(err) {
      console.log(err);
    }
  }
  add(formData) {
    if (!formData) {
      throw new Error(`No form data found`);
    }
    const { name, email, message, subscribe } = formData;
    const user = {
      id: ++this.counter, 
      name, 
      email,
      message,
      subscribe: subscribe ? 'tick' : '',
      added: new Date()
    };
    const updatedData = [ ...this.getData(), user];
    this.saveData(updatedData);
  }
  delete(id) {
    const userExists = this.getData().find(item => item.id === id);
    if (!userExists) {
      throw new Error(`Record with ID '${id}' does not exist`);
    }
    const updatedUsers = this.getData().filter(item => item.id !== id);
    this.saveData(updatedUsers);
  }
  getLastId() {
    return this.getData().reduce((acc, item) => {
      if (Number(item.id) > acc) acc = item.id;
      return acc;
    }, 0);
  }
}

module.exports = Users;