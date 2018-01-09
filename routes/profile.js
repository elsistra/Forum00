module.exports = function (app) {
  // Render the dashboard page on request
  app.get('/profile', (req, res) => {
    res.render('profile', { session: req.session });
  });
};
