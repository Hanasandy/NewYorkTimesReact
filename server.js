// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require History Schema
var History = require("./models/history");

// Create Instance of Express
var app = express();

// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));


//MongoDB(monggose) connection ---------------------------------

// MongoDB Configuration configuration
//mongoose.connect("mongodb://localhost/nytreact");
mongoose.connect("mongodb://heroku_rsl43tx1:hd17lonv50hobpc3465u5u8spm@ds129402.mlab.com:29402/heroku_rsl43tx1");
//mongoose.connect(process.env.MONGODB_URI || "mongodb://heroku_rsl43tx1:hd17lonv50hobpc3465u5u8spm@ds129402.mlab.com:29402/heroku_rsl43tx1");

var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes

// HTML Routes ---------------------------------
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// API Routes ---------------------------------
// This is the route we will send GET requests to retrieve our most recent search data.
app.get("/api/saved", function(req, res) {

  // We will find all the records
  History.find({}).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// This is the route we will send POST requests to save each article.
app.post("/api/saved", function(req, res) {
  console.log(req.body);

  History.create({
    title: req.body.title,
    date: req.body.date,
    url: req.body.url,
    saved: req.body.saved,
    notes: []
  }, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("saved");
    }
  });
});

// Delete Route ---------------------------------
app.post("/api/saved/:noteId", function(req, res) {
  var noteId = req.params.noteId;
  console.log(noteId);
  History.remove({ '_id': noteId })
    // Now, execute the query
    .exec(function(error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.redirect("/");
      }
    });
});


// Listener ---------------------------------
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});