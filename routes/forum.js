module.exports = function (app) {
  // Render the messages page on request
  app.get('/forum', (req, res) => {
    // Send along Session Data
    res.render('forum', { session: req.session });
  })
};
