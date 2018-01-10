console.log('[[debug]]', 'executing client.js');
const socket = io();

// Initialize data.
let data = {
  someProperty1: 'some-default-value',
  someProperty2: 123,
  someProperty3: false,
  users: [],
  threads: []
};

// Create a UsersListItems component.
const UsersListItems = {
  // mithril will use components' `view()` method to generate HTML.
  view: function () {
    // Create array of virtual elements from array of users.
    const items = data.users.map((user) => {
      return m('li', { class: 'users-item' }, [
        m('span', { class: 'user-username' }, user.username)
      ]);
    });

    // Return virtual elements to render.
    return items;
  }
}

// Create a ThreadsTableRows component.
const ThreadsTableRows = {
  // mithril will use components' `view()` method to generate HTML.
  view: function () {
    // Create array of virtual elements from array of threads.
    const rows = data.threads.map((thread) => {
      return m('div', { class: 'table-tr' }, [
        m('div', { class: 'table-td' }, thread.subject || 'n/a'),
        m('div', { class: 'table-td' }, thread.posts || 0),
        m('div', { class: 'table-td' }, thread.lastReply || 'n/a')
      ]);
    });

    // Return virtual elements to render.
    return rows;
  }
}

// Usage:

// Find an element and mount component onto it. Component's view method will be
// invoked to efficiently populate mounted component every redraw.
m.mount(document.querySelector('#threadsTableTbody'), ThreadsTableRows);

// Listen for threads array response from server
socket.on('threads-list', function (threadsArray) {
  //How do I pass this to forum.ejs so that I can parse it from there?
  // A: You cannot. At this point, views/forum.ejs is history. The file
  // file is a server-side template that was used to produce HTML sent to the
  // user. Now that the user has the HTML, views/forum.ejs is abandoned.

  console.log('[[debug]]', 'rt:threads-list', threadsArray);

  // Update the threads data.
  data.threads = threadsArray;

  // Redraw components.
  m.redraw();
});

// Ask server for threads data
socket.emit('want-threads-list');

// For admin view only. Hacky but works: Check for admin view by attempting to
// find an element IDed "admin-view". If it exists, then user is in admin view.
if (document.querySelector('#admin-view')) {
  // Find an element and mount component onto it. Component's view method will be
  // invoked to efficiently populate mounted component every redraw.
  m.mount(document.querySelector('#usersList'), UsersListItems);

  // Listen for users array replacement from server
  socket.on('users-list', function (usersArray) {
    // Update the users data.
    data.users = usersArray;

    // Redraw components.
    m.redraw();
  });

  // Ask server for users data
  socket.emit('want-users-list');
}

// Initial draw of data.
m.redraw();
