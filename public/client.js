console.log('Hello');
const socket = io();

// Ask server for users data
socket.emit('want-users-list');

// Listen for users array replacement from server
socket.on('users-list', function (usersArray) {
  var listElement = document.getElementById('usersList');
  // For each user in Users array...
  usersArray.forEach((user) => {
    const newElement = document.createElement('li');
    newElement.textContent = user.username;
    listElement.appendChild(newElement);
  });
});


// Ask server for threads data
socket.emit('want-thread-list');

// Listen for threads array response from server
socket.on('threads-list', function (threadsArray) {
  //How do I pass this to forum.ejs so that I can parse it from there?
});
