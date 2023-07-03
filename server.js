// Importing Modules
const express = require("express");
const mongoose = require("mongoose");

// Importing Models
const Note = require("./models/note");
const Message = require("./models/message");

// Inititating Express
const app = express();

// Link to Database
// const dbURL = "mongodb+srv://chiragchakraborty48:15w2kk6af0i2kocC@cluster0.od7pdi4.mongodb.net/?retryWrites=true&w=majority";
const dbURL = "mongodb+srv://atanupaul03:UlzBd1x6xOTUdirq@cluster0.jinklwv.mongodb.net/?retryWrites=true&w=majority";

// Connecting to Database
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(3000, () => {
      console.log("Connection to the Database was established!");
      console.log("Server running at: http://localhost:3000");
    })
  )
  .catch((error) => console.log(error));

// Middlewares
app.use(express.json()); // JSON Parser
app.use(express.urlencoded({ extended: true })); // URL Body Parser

app.set("view engine", "ejs"); // Template Engine
app.use(express.static(__dirname + "/public")); // Public Folder

// Routes

// Home Page
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// About Page
app.get("/about-us", (req, res) => {
  res.render("about", { title: "About Us" });
});

// Redirect
app.get("/about", (req, res) => {
  res.redirect("/about-us");
});

// Contact Page
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Get in Touch" });
});

// To retrieve all notes from the database
app.get("/notes", (req, res) => {
  Note.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("notes", { title: "All Notes", notes: result });
    })
    .catch((error) => console.log(error));
});

// To submit message through contact form
app.post("/submitMessage", (req, res) => {
  let message = new Message(req.body);
  message
    .save()
    .then((result) => {
      res.render("success", { title: "Success" });
    })
    .catch((error) => res.json({ msg: error.message }));
});

// Render Add Form
app.get("/addNote", (req, res) => {
  res.render("add", { title: "Add Note" });
});

// To add a new note to the database
app.post("/addNote", (req, res) => {
  let note = new Note({
    title: req.body.title,
    details: req.body.details,
  });
  note
    .save()
    .then((result) => {
      res.redirect("/notes");
    })
    .catch((error) => res.json({ msg: error.message }));
});

// To retrive a single note by its ID
app.get("/note/:id", (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .then((result) => res.json(result))
    .catch((error) => res.json({ msg: error.message }));
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .then((result) => {
      res.render("edit", { title: "Update", note: result });
    })
    .catch((error) => res.json({ msg: error.message }));
});

// To edit/update an existing note
app.post("/editNote/:id", (req, res) => {
  const id = req.params.id;
  Note.findByIdAndUpdate(id, req.body)
    .then((result) => res.redirect("/notes"))
    .catch((error) => res.json({ msg: error.message }));
});

// To delete a note from the database
app.get("/deleteNote/:id", (req, res) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((result) => res.redirect("/notes"))
    .catch((error) => res.json({ msg: error.message }));
});

app.get("/deleteAll", (req, res) => {
  Note.deleteMany()
  .then((result) => {
    res.redirect('/notes');
  })
  .catch((error) => res.json({ msg: error.message}));
})