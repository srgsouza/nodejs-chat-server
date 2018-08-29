const path = require('path'); // native node.js module that handles path.
const express = require('express');
const socketIO = require('socket.io'); // enables realtime, bi-directional communication between web clients and servers.
const http = require('http');  // Required to integrate socket io functionality

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users'); // user methods - add, remove, get user...
// console.log(__dirname + '/../public'); // "old" way
// console.log(publicPath);     // using 'path.join()  yields cleaner code
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000; // Needed for Heroku - 'process.env' stores the environment variables/values
var app = express();
var server = http.createServer(app);  // (note: http is used behind the scenes to integrate 'express')
var io = socketIO(server);
var users = new Users();

// // This middleware will server the maintenance page and stop all other requests - note the absense of next()
// // Uncomment when site is under maintenance
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// })

// Middleware that serves static files - __dirname gets the program directory
app.use(express.static(publicPath));  // 'app.use' is how we register a middleware. It takes a function

//  *** Targeting ***
// io.emit -> emits to every connected user
// io.to('aSpecifChatRoom').emit -> emits to every connected user of a specific room
// socket.broadcast.emit -> emits to every connected user, except the emitter
// socket.broadcast.to('aSpecifChatRoom').emit -> emits to every connected user of a specific room, except the emitter
// socket.emit -> emits to one user

io.on('connection', (socket) => { // register an event listener. requires a callback function
  console.log('New user connected');

  socket.on('join', (params) => {
    console.log(`${params.name} joined in room ${params.room}`);
    if (!isRealString(params.name) || !isRealString(params.room)) { // check for valid user name and room name (string, not empty)
      // return callback('Name and room name are required');
      console.log("Name and room name are required");
    }

    socket.join(params.room);  // user joins room
    users.removeUser(socket.id);  // remove user from any potential previous rooms
    users.addUser(socket.id, params.name, params.room); // add user to new room

    io.to(params.room).emit('updateUserList', users.getUserList(params.room)); // emit an event to everyone in the chatroom
    socket.emit('newMessage', generateMessage('gHost/Rider', 'Welcome!'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('gHost/Rider', `${params.name} has joined.`));
  });

  // listens for a message from the client 'createMessage' - client needs an emit function for it
  socket.on('createMessage', (message) => {  // callback is used for acknowledgments - ie. send error msg back to the client
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) { // if user exists and message is valid
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    console.log("user is " + user.name + " and room is " + user.room );
    
  });

  // listens for the geolocation message coming from the client
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitute, coords.longitude));
    }
  });

  socket.on('disconnect', () => { // when a user disconnects...
    var user = users.removeUser(socket.id); // remove the user from the list of users

    if (user) {  // if a user was indeed removed...
      io.to(user.room).emit('updateUserList', users.getUserList(user.room)); // send an updated user list to everyone in the chatroom
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
