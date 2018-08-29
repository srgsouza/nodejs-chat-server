
// socket.io enables realtime, bi-directional communication between web clients and servers.

var socket = io();

// enables autoscrolling
function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    console.log('Should scroll');
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {  // connect is a built-in listener
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No Error');
    }
  });
});

socket.on('disconnect', function () { // disconnect is a built-in listener
  console.log('from index.js - Disconnected from Server');
});

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  })

  jQuery('#users').html(ol);

  console.log('Users list', users);
});

socket.on('newMessage', function (message) { // listening for new messages from the server
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
  // // Code bellow was used prior to implementation of the template engine mustache.js
  // var formattedTime = moment(message.createdAt).format('h:mm a');
  // var li = jQuery('<li></li>');
  // li.text(`${formattedTime} - ${message.from}: ${message.text}`);
  //
  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('');  // clears the value of the textbox
  });
});

// listenerefor the send-location button
var locationButton = jQuery('#send-location');
locationButton.on('click', function () { // same as jQuery('#send-location').on
  if (!navigator.geolocation) {  // checks if user browser has access to the geolocation function
    return alert('Geolocation not supported by your browser.'); // return alert if browser has no support/access
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');  // disables the location button after it is clicked (will be re-enabled down bellow)

  navigator.geolocation.getCurrentPosition(function (position) {  // this executes if browser has access to geolocation function
    locationButton.removeAttr('disabled').text('Send location'); // removes the attribute that disabled the location button
    socket.emit('createLocationMessage', {  // emits message to server with lat and lng data
      latitute: position.coords.latitude,   // coordinate variables - I used chrome browser dev tool extension to see these variables
      longitude: position.coords.longitude // removes the attribute that disabled the location button
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
