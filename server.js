/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  Name: Akshar Jigneshkumar Pastagia     Student ID: 186241238     Date: 04/03/2025
*  Online (Vercel) Link: https://your-web700-app.vercel.app
********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./collegeData"); // Import collegeData module

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Step 1: Serve static files from the "public" directory
app.use(express.static("public"));

// Step 2: Enable body-parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));

// ✅ Route: Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// ✅ Route: About Page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// ✅ Route: HTML Demo Page
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// ✅ Route: Show "Add Student" Form (GET)
app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// ✅ Route: Handle form submission to add a new student (POST)
app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect('/students'))  // Redirect to students list after adding
        .catch(err => res.status(500).send("Error adding student: " + err));
});

// ✅ Route: Get All Students (With Optional Course Filter)
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then(data => res.json(data))
            .catch(err => res.json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(data => res.json(data))
            .catch(err => res.json({ message: "no results" }));
    }
});

// ✅ Route: Get All Courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(data => res.json(data))
        .catch(err => res.json({ message: "no results" }));
});

// ✅ Route: Get All Teaching Assistants (TAs)
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(data => res.json(data))
        .catch(err => res.json({ message: "no results" }));
});

// ✅ Route: Get Student by Student Number
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(data => res.json(data))
        .catch(err => res.json({ message: "no results" }));
});

// ✅ Route: 404 Not Found (Must be at the end)
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// ✅ Initialize Data and Start Server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`));
    })
    .catch(err => console.log("Error initializing data:", err));


    module.exports = app;

