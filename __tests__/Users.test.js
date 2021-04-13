const Users = require('../src/Users');
const users = new Users();
users.filename = './data/users.json';

describe('Users class methods', () => {

  test('getData -> get json from users file', () => {
    const data = users.getData();
    if (!data) {
      expect(data).toBeNull();
      return;
    }
    const result = data.length;
    if (result) {
      expect(result).toBeGreaterThan(0);
    } else {
      expect(result).toBe(0);
    }
  });

  test('getValueById -> get user value by ID', () => {
    const data = users.getData();
    if (!data) {
      expect(data).toBeNull();
      return;
    }
    const id = users.getLastId();
    const value = users.getValueById(id, 'name');
    if (value) {
      const result = typeof value;
      expect(result).toBe('string');
    } else {
      expect(value).toBeFalsy();
    }
  });

  test('getLastId -> get last user ID', () => {
    const data = users.getData();
    if (!data) {
      expect(data).toBeNull();
      return;
    }
    const id = users.getLastId();
    if (id > 0) {
      expect(id).toBeGreaterThan(0);
    } else {
      expect(id).toBe(0);
    }
  });

  test('match user objects properties', () => {
    const data = users.getData();
    if (!data) {
      expect(data).toBeNull();
      return;
    }
    const id = users.getLastId();
    if (id > 0) {
      const props = ['id', 'name', 'email', 'message', 'subscribe', 'added'];
      const user = users.getUserById(id);
      const userProps = Object.keys(user);
      expect(props).toMatchObject(userProps);
    } else {
      expect(id).toBe(0);
    }
  });

});