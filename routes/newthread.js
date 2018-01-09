module.exports = function (app) {

  const bodyParser = require('body-parser');
  const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });

  const db = app.get('db')
  const threads = db.collection("threads");

  // When the form is posted, this function will run
  app.post('/newthread', urlencodedBodyParser, async(req, res) =>{

    //If the user is not logged in, send them to the index
    if(!req.session){
      res.redirect('/index');
      return;
    }

    // Get the POST content from the form
    let subject = req.body.subject;
    let content = req.body.threadcontent;

    // Ensure no fields are empty
    if (!subject || !content) {
      console.log('A field was left empty');
    }else{
      //Insert new thread into database
      const result = await threads.insert({subject: subject, content: content});
      //Send the user back to the forum page
      res.redirect('/forum');
    }
  })

};
