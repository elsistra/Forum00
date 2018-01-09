module.exports = function (app) {
  // Render the messages page on request
  app.get('/messages', (req, res) => {
    // Send along Session Data
    res.render('messages', { session: req.session });
  })
};
