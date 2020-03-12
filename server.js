// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require('fs');

// Sets up the Express App
// =============================================================
var app = express();
//var PORT = 3000;
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("Develop/public"));

// Put notes into this array
// =============================================================
var notes = [];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

app.get("/api/notes", function(req, res) {

  console.log(notes)
  return res.json(notes);
   //return notes;
  

    //console.log('This is after the read call');
    //return res.json(notes);
});

//app.get("*", function(req, res) {
//  res.sendFile(path.join(__dirname, "index.html"));
//});

// Displays all characters
//app.get("/api/characters", function(req, res) {
//  return res.json(characters);
//});

// Displays a single character, or returns false
//app.get("/api/notes/:notes", function(req, res) {
  app.delete("/api/notes/:notes", function(req, res) {
  var chosen = req.params.notes;
  console.log(chosen);


  for (var i = 0; i < notes.length; i++) {
    if (chosen === notes[i].id) {
      console.log("In delete")  
      notes.splice(i, 1);
      console.log(notes)

      let data = JSON.stringify(notes, null, 2);

      fs.writeFile('Develop/db/db.json', data, (err) => {
        if (err) throw err;
      console.log('Data written to file');
  });

      //return res.json(notes[i]);
    }
  }

  return res.json(false);
});

// Create New Characters - takes in JSON input
app.post("/api/notes", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  console.log("i'm here")
  var newNote = req.body;
  console.log(newNote);
  newNote.id = newNote.title; 
  notes.push(newNote);
  console.log(newNote.title);
  console.log(notes)

  newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();

  let data = JSON.stringify(notes, null, 2);

  fs.writeFile('Develop/db/db.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  //newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();
  //newNote.id = newNote.title //.replace(/\s+/g, "").toLowerCase();
  console.log(newNote);

  res.redirect("/");

  //notes.push(newNote);

  //res.json(newNote);
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
  loadDBtoArray();
});

function loadDBtoArray() {

  console.log("in loadDB")

  fs.readFile('Develop/db/db.json', (err, data) => {
    if (err) throw err;
    let notesIn = JSON.parse(data);
  

  for (var i = 0; i < notesIn.length; i++) {
      console.log(notesIn[i]);
      notes.push(notesIn[i]);
   }
  });
 
};
