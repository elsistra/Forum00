const state = {
  threads: []
};
const ThreadList = {
  view: function () {
    return m('div.table', [
        m('div.table-thead', [
          m('div.table-th.subject', 'Subject'),
          m('div.table-th.postscount', 'Posts'),
          m('div.table-th.lastreply', 'Last Reply')
        ]),
        m('div.table-tbody', state.threads.map((thread) => {
          return m('div.table-tr', [
            m('div.table-td.subject', thread.subject),
            m('div.table-td.postscount', thread.posts),
            m('div.table-td.lastreply', thread.lastReply)
          ])
        }))
    ])
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
socket.on('threads-list--remove-thread', function (thread) {
  const index = state.threads.findIndex((item) => item._id === thread._id);
  if (index > -1) state.threads.splice(index, 1);
  m.redraw();
});
socket.emit('want-threads-list');
