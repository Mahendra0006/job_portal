const users = [];
let userIdCounter = 1;

export function addUser({ name, email, password }) {
  const user = { id: userIdCounter++, name, email, password };
  users.push(user);
  return user;
}

export function getUserByEmail(email) {
  return users.find(u => u.email === email);
}

export function getUserById(id) {
  return users.find(u => u.id === id);
}

export function validateUser(email, password) {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}