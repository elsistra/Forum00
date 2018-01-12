const state = {
  threads: []
};
function mountCssTable(selector, header, body, footer) {
  const element = document.querySelector(selector);

  const componentView = function () {
    const tableHeaderType = 'div';
    const tableHeaderAttributes = { class: 'table-thead' };
    const tableHeaderChildren = header();
    const tableHeader = m(tableHeaderType, tableHeaderAttributes, tableHeaderChildren);

    const tableBodyType = 'div';
    const tableBodyAttributes = { class: 'table-tbody' };
    const tableBodyChildren = body();
    const tableBody = m(tableBodyType, tableBodyAttributes, tableBodyChildren);

    const tableFooterType = 'div';
    const tableFooterAttributes = { class: 'table-tfoot' };
    const tableFooterChildren = footer();
    const tableFooter = m(tableFooterType, tableFooterAttributes, tableFooterChildren);

    return [tableHeader, tableBody, tableFooter];
  }

  const Component = {
    view: componentView
  };

  m.mount(element, Component);
}

const tableSelector = '#threads-list';
const tableHeader = function () {
  const subjectType = 'div';
  const subjectAttributes = { class: 'table-th subject' };
  const subjectChildren = 'Subject';
  const subjectHeader = m(subjectType, subjectAttributes, subjectChildren);

  const postsType = 'div';
  const postsAttributes = { class: 'table-th postscount' };
  const postsChildren = 'Posts';
  const postsHeader = m(postsType, postsAttributes, postsChildren);

  const lastReplyType = 'div';
  const lastReplyAttributes = { class: 'table-th lastreply' };
  const lastReplyChildren = 'Last Reply';
  const lastReplyHeader = m(lastReplyType, lastReplyAttributes, lastReplyChildren);

  const rowType = 'div';
  const rowAttributes = { class: 'table-tr' };
  const rowChildren = [subjectHeader, postsHeader, lastReplyHeader];

  return m(rowType, rowAttributes, rowChildren);
};
const tableBody = function () {
  return state.threads.map((thread) => {
    const subjectType = 'div';
    const subjectAttributes = { class: 'table-td subject' };
    const subjectChildren = thread.subject;
    const subjectCell = m(subjectType, subjectAttributes, subjectChildren);

    const postsType = 'div';
    const postsAttributes = { class: 'table-td postscount' };
    const postsChildren = thread.posts;
    const postsCell = m(postsType, postsAttributes, postsChildren);

    const lastReplyType = 'div';
    const lastReplyAttributes = { class: 'table-td lastreply' };
    const lastReplyChildren = thread.lastReply;
    const lastReplyCell = m(lastReplyType, lastReplyAttributes, lastReplyChildren);

    const rowType = 'div';
    const rowAttributes = { class: 'table-tr' };
    const rowChildren = [subjectCell, postsCell, lastReplyCell];

    return m(rowType, rowAttributes, rowChildren);
  });
};
const tableFooter = function () {};
mountCssTable(tableSelector, tableHeader, tableBody, tableFooter);

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
