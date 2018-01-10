// NPM Libraries to use
const http = require('http');
const express = require('express');
const session = require('express-session');
const io = require('socket.io');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
// Create the HTTP & RealTime Server
const httpServer = http.createServer(app);
const realtimeServer = io(httpServer);
// Set the View Engine
app.set('view engine', 'ejs');
// Connect to Database
var url = "mongodb://localhost:27017/forum00";
mongodb.connect(url, function(err, client) {
  if (err) throw err;
  console.log("Database connection success");
  // MongoDB includes a ObjectID property
  const ObjectId = mongodb.ObjectId;
  // Specify the Database name for MongoDB
  const db = client.db('forum00');
  //Sets the database to global app variable?
  app.set('db', db);
  // Specify the collection inside the database we will be working with
  const usersCollection = db.collection("users");
  const threadsCollection = db.collection("threads");
  // Settup sessions
  app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true
  }));
  // Let Express know where to find the public folder
  app.use('/public', express.static('public'));


  // ROUTE HANDLERS BELOW THIS LINE -----------------------------------------------------------------------------
  // Render the index page on request
  require('./routes/index')(app);
  //Handle user Sign-Out
  require('./routes/sign-out')(app);
  // Render the register page on request
  require('./routes/register')(app);
  // Render the admin page on request
  require('./routes/admin')(app);
  // Render the dashboard page on request
  require('./routes/dashboard')(app);
  require('./routes/profile')(app);
  require('./routes/log-in')(app);
  require('./routes/messages')(app);
  require('./routes/forum')(app);
  require('./routes/newthread')(app);

  // REAL TIME SERVER EMITS AND LISTENERS HERE -------------------------------------------------------------
  realtimeServer.on('connect', function (socket) {
    // A client has connected to the realtime server.
    console.log('[[debug]] '+socket.id, 'rt:connect');

    socket.on('want-users-list', async function () {
      // This client is asking for users list data
      console.log('[[debug]] '+socket.id, 'rt:want-users-list');
      const usersList = await usersCollection.find().toArray();
      socket.emit('users-list', usersList);
    });

    socket.on('want-threads-list', async function () {
      // This client is asking for threads list data
      console.log('[[debug]] '+socket.id, 'rt:want-threads-list');
      const threadsList = await threadsCollection.find().toArray();
      socket.emit('threads-list', threadsList);
    });
  });

  //Start the server
  httpServer.listen(8080, function () {
      console.log('Listening on port 8080.')
  });
});
