const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

class Users {
  constructor() {
    this.filename = './data/' + process.env.FILENAME;
    this.testing = process.env.NODE_ENV === 'test';
    if (!this.testing) this.init();
  }
  init() {
    if (!fs.existsSync(this.filename)) {
      this.saveData([]);
    }
  }
  getData() {
    try {
      const fileContents = fs.readFileSync(this.filename);
      const data = JSON.parse(fileContents);
      return data.sort((a, b) => new Date(b.added) - new Date(a.added));
    } catch(err) {
      if (this.testing) return null;
      throw new Error(err);
    }
  }
  saveData(data) {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(data));
    } catch(err) {
      if (this.testing) return null;
      throw new Error(err);
    }
  }
  add(formData) {
    if (!formData) {
      throw new Error(`No form data found`);
    }
    const { name, email, message, subscribe } = formData;
    const user = {
      uuid: uuidv4(),
      name, 
      email,
      message,
      subscribe: subscribe ? 'tick' : '',
      added: new Date()
    };
    const updatedData = [ ...this.getData(), user];
    this.saveData(updatedData);
  }
  delete(uuid) {
    const userExists = this.getData().find(item => {
      return item.uuid === uuid;
    });
    if (!userExists) {
      throw new Error(`Record with ID '${uuid}' does not exist`);
    }
    const updatedUsers = this.getData().filter(item => item.uuid !== uuid);
    this.saveData(updatedUsers);
  }
  getUserById(uuid) {
    return this.getData().find(item => {
      return item.uuid === uuid;
    });
  }
  getValueById(uuid, prop) {
    const found = this.getUserById(uuid);
    return (found && found[prop]) || false;
  }
}

module.exports = Users;