const state = {
  threads: {
    columns: [
      { key: 'subject', heading: 'Subject', class: 'subject', default: '' },
      { key: 'posts', heading: 'Posts', class: 'postscount', default: 0 },
      { key: 'lastReply', heading: 'Last Reply', class: 'lastreply', default: 'n/a' }
    ],
    rows: []
  }
};
function mountCssTable(selector, substate) {
  m.mount(document.querySelector(selector), {
    view: function () {
      return [
        m('div', { class: 'table-thead' }, [
          m('div', { class: 'table-tr' }, [
            substate.columns.map(function (column) {
              const classes = 'table-td ' + (column.class || '');
              return m('div', { class: classes }, column.heading);
            })
          ])
        ]),
        m('div', { class: 'table-tbody' }, [
          substate.rows.map(function (row) {
            return m('div', { class: 'table-tr' }, substate.columns.map(function (column) {
              let value;
              if (row[column.key] != null) {
                value = row[column.key];
              } else {
                value = column.default;
              }
              const classes = 'table-td ' + (column.class || '');
              return m('div', { class: classes }, value);
            }));
          })
        ])
      ]
    }
  });
}
mountCssTable('#threadsTableTbody', state.threads);
m.redraw();

const socket = io();
socket.on('threads-list', function (threads) {
  state.threads.rows = threads;
  m.redraw();
});
socket.on('threads-list--add-thread', function (thread) {
  const index = state.threads.rows.findIndex((item) => item._id === thread._id);
  if (index > -1) state.threads.rows.splice(index, 1, thread);
  else state.threads.rows.push(thread);
  m.redraw();
});
socket.on('threads-list--remove-thread', function (thread) {
  const index = state.threads.rows.findIndex((item) => item._id === thread._id);
  if (index > -1) state.threads.rows.splice(index, 1);
  m.redraw();
});
socket.emit('want-threads-list');
