[{
  id: "/asdf;a;sdfasdfj",
  name: "Andrew",
  room: "some room"
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id); // builds an array with all users,  without the matching user if any
    }

    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0] // returns the first item of the array. We should have either one or zero users returned

  }
  getUserList (room) {
    // filter gets called with each individual user, returns user(s) that matches the room condition
    var users = this.users.filter((user) => user.room === room); // array with all items that matched the criteria
    var namesArray = users.map((user) => user.name); // convert array of objects into array of strings (return the names)

    return namesArray;
  }
}

module.exports = {Users};

// // ES6 Classes
// class Person {
//   constructor (name, age) { // gets called by default
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription () {
//     return `${this.name} is ${this.age} years(s) old.`;
//   }
// }
//
// var me = new Person('Serg', 6);
// var description = me.getUserDescription();
// console.log(description);
