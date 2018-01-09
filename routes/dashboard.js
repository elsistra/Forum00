module.exports = function (app) {
  // Render the dashboard page on request
  app.get('/dashboard', (req, res) => {
    res.render('dashboard', { session: req.session });
  });
};
