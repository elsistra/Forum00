console.log('[[debug]]', 'executing client.js');
const socket = io();

// Initialize current data.
let data = {
  someProperty1: 'some-default-value',
  someProperty2: 123,
  someProperty3: false,
  users: [],
  threads: []
};

// Initialize previous data.
let prevData = data;

// Create update data helper.
function updateData (update) {
  // Current data becomes previous data.
  prevData = data;

  // Update data by merging current data and new data.
  data = Object.assign({}, data, update);
}

// Create render users item helper.
function renderUsersItem (localData) {
  // Create element to contain more elements.
  const el = document.createElement('li');
  el.classList.add('users-item');

  // Create the username div.
  const usernameEl = document.createElement('div');
  usernameEl.classList.add('user-username');
  usernameEl.textContent = localData.username;

  // Append elements.
  el.appendChild(usernameEl);

  return el;
}

// Create render users list helper.
function renderUsersList (localData) {
  // Create element to contain more elements.
  const el = document.createElement('ul');
  el.classList.add('users-list');

  localData.users.forEach((user) => {
    // Create a child element.
    const childEl = renderUsersItem (user);
    // Append child element.
    el.appendChild(childEl);
  });

  return el;
}

// Create render threads item helper.
function renderThreadsTableTr (localData) {
  // Create element to contain more elements.
  const el = document.createElement('div');
  el.classList.add('table-tr');

  // Create a subject div.
  const subjectEl = document.createElement('div');
  subjectEl.classList.add('table-td');
  subjectEl.textContent = localData.subject;

  // Create a posts div.
  const postsEl = document.createElement('div');
  postsEl.classList.add('table-td');
  postsEl.textContent = localData.posts || 0;

  // Create a last reply div.
  const lastReplyEl = document.createElement('div');
  lastReplyEl.classList.add('table-td');
  lastReplyEl.textContent = localData.lastReply || 'n/a';

  // Append elements.
  el.appendChild(subjectEl);
  el.appendChild(postsEl);
  el.appendChild(lastReplyEl);

  return el;
}

// Create render threads tbody helper.
function renderThreadsTableTbody (localData) {
  // Create element to contain more elements.
  const el = document.createElement('div');
  el.classList.add('table-tbody');

  localData.threads.forEach((thread) => {
    // Create a child element.
    const childEl = renderThreadsTableTr (thread);
    // Append child element.
    el.appendChild(childEl);
  });

  return el;
}

// Create redraw users list helper.
function redrawUsersList (elId, localData) {
  // Create new (redrawn) element.
  const el = renderUsersList(localData);

  // Apply supplied element ID.
  el.setAttribute('id', elId);

  // Assumes the same IDed element exists.
  const prevEl = document.querySelector('#'+elId);

  // Skip rest if element is missing.
  if (!prevEl) { return; }

  // Replace previous element with new (redrawn) element.
  prevEl.parentNode.replaceChild(el, prevEl);
}

// Create redraw threads table tbody helper.
function redrawThreadsTableTbody (elId, localData) {
  // Create new (redrawn) element.
  const el = renderThreadsTableTbody(localData);

  // Apply supplied element ID.
  el.setAttribute('id', elId);

  // Assumes the same IDed element exists.
  const prevEl = document.querySelector('#'+elId);

  // Skip rest if element is missing.
  if (!prevEl) { return; }

  // Replace previous element with new (redrawn) element.
  prevEl.parentNode.replaceChild(el, prevEl);
}

// Create _redrawData function, please do not directly call this.
function _redrawData () {
  if (prevData.someProperty1 !== data.someProperty1) {
    // Update elements based on someProperty1 data.
  }

  if (prevData.someProperty2 !== data.someProperty2) {
    // Update elements based on someProperty2 data.
  }

  if (prevData.someProperty3 !== data.someProperty3) {
    // Update elements based on someProperty3 data.
  }

  if (prevData.users !== data.users) {
    // Users were updated, redraw users.
    redrawUsersList('usersList', data);
  }

  if (prevData.threads !== data.threads) {
    // Threads were updated, redraw threads.
    redrawThreadsTableTbody('threadsTableTbody', data);
  }

  // ... infinitely more updates to consider
}

/*

  <div class='table-tr'>
    <div class='table-td'>Hello crazy crazy world</div><div class='table-td'>0</div><div class='table-td'>01/01/2018 18:45</div>
  </div>
  */

// Create redraw data function. Indirectly calls _redrawData once per frame.
// This is better than a bunch of wasted redraws which consumes CPU/power
// because users will only ever see the final redraw in that bunch.
let redrawId;
function redrawData () {
  // Cancel pending redraw.
  window.cancelAnimationFrame(redrawId);

  // Queue redraw.
  redrawId = window.requestAnimationFrame(_redrawData);
}

// Usage:

// Listen for threads array response from server
socket.on('threads-list', function (threadsArray) {
  //How do I pass this to forum.ejs so that I can parse it from there?
  // A: You cannot. At this point, views/forum.ejs is history. The file
  // file is a server-side template that was used to produce HTML sent to the
  // user. Now that the user has the HTML, views/forum.ejs is abandoned.

  console.log('[[debug]]', 'rt:threads-list', threadsArray);

  // Update the threads data.
  updateData({ threads: threadsArray });

  // Redraw data.
  redrawData();
});

// Ask server for threads data
socket.emit('want-threads-list');

// For admin view only. Hacky but works: Check for admin view by attempting to
// find an element IDed "admin-view". If it exists, then user is in admin view.
if (document.querySelector('#admin-view')) {
  // Listen for users array replacement from server
  socket.on('users-list', function (usersArray) {
    // Update the users data.
    updateData({ users: usersArray });

    // Redraw data.
    redrawData();
  });

  // Ask server for users data
  socket.emit('want-users-list');
}

// Initial draw of data.
redrawData();
