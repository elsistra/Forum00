const state = {
  threads: []
};
const ThreadList = {
  view: function () {
    // Creates virtual elements representing..
    return m('div.table', [ // <div class="table">
        m('div.table-thead', [ // <div class="table-thead">
          m('div.table-tr', [, // <div class"table-tr">
            m('div.table-th.subject', 'Subject'), // <div class"table-th subject">Subject</div>
            m('div.table-th.postscount', 'Posts'), // <div class"table-th postscount">Posts</div>
            m('div.table-th.lastreply', 'Last Reply') // <div class"table-th lastreply">Last Reply</div>
          ]) // </div> (closes div.table-tr)
        ]), // </div> (closes div.table-thead)

        // Note that for the children of div.table-tbody, we're mapping threads array to a new array.
        // The new array will consist of div.table-trs instead of the original thread items.
        m('div.table-tbody', state.threads.map((thread) => { // <div class="table-tbody">
          // Creates virtual elements for each thread, representing...
          return m('div.table-tr', [ // <div class"table-tr">
            m('div.table-td.subject', thread.subject), // <div class"table-td subject">THREAD_SUBJECT</div>
            m('div.table-td.postscount', thread.posts), // <div class"table-td postscount">THREAD_POSTS</div>
            m('div.table-td.lastreply', thread.lastReply)// <div class"table-td lastreply">THREAD_LAST_REPLY</div>
          ]) // </div> (closes div.table-tr)
        })) // </div> (closes div.table-tbody)
    ]); // </div> (closes div.table)
  }
}

m.mount(document.querySelector('#thread-list-container'), ThreadList);

const socket = io();
socket.on('threads-list', function (threads) {
  state.threads = threads;
  m.redraw();
});
socket.on('threads-list--add-thread', function (thread) {
  const index = state.threads.findIndex((item) => item._id === thread._id);
  if (index > -1) state.threads.splice(index, 1, thread);
  else state.threads.push(thread);
  m.redraw();
});
socket.on('threads-list--update-thread', function (thread) {
  const index = state.threads.findIndex((item) => item._id === thread._id);
  if (index > -1) state.threads.splice(index, 1, thread);
  m.redraw();
});
socket.on('threads-list--remove-thread', function (thread) {
  const index = state.threads.findIndex((item) => item._id === thread._id);
  if (index > -1) state.threads.splice(index, 1);
  m.redraw();
});
socket.emit('want-threads-list');
