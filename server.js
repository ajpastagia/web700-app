/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  Name: Akshar Jigneshkumar Pastagia     Student ID: 186241238     Date: 04/03/2025
*  Online (Vercel) Link: https://your-web700-app.vercel.app
********************************************************************************/

const fs = require("fs");
const path = require("path");

// ✅ Define paths for JSON files (Read-Only in Vercel)
const studentsFilePath = path.join(__dirname, "data", "students.json");
const coursesFilePath = path.join(__dirname, "data", "courses.json");

// ✅ Class to Hold Data in Memory
class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null; // Store in-memory data

// ✅ Initialize Data (Read JSON Files)
const initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(coursesFilePath, "utf8", (err, courseData) => {
            if (err) {
                console.error("❌ Error reading courses.json:", err);
                return reject("Unable to load courses");
            }

            fs.readFile(studentsFilePath, "utf8", (err, studentData) => {
                if (err) {
                    console.error("❌ Error reading students.json:", err);
                    return reject("Unable to load students");
                }

                // ✅ Load students and courses into memory (NO FILE WRITING)
                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                console.log("✅ Data successfully loaded into memory.");
                resolve();
            });
        });
    });
};

// ✅ Get All Students
const getAllStudents = () => {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.students.length === 0) {
            reject("No students found.");
            return;
        }
        resolve(dataCollection.students);
    });
};

// ✅ Get Teaching Assistants (TAs)
const getTAs = () => {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized.");
            return;
        }

        const filteredStudents = dataCollection.students.filter(student => student.TA === true);
        if (filteredStudents.length === 0) {
            reject("No TAs found.");
            return;
        }

        resolve(filteredStudents);
    });
};

// ✅ Get All Courses
const getCourses = () => {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.courses.length === 0) {
            reject("No courses found.");
            return;
        }
        resolve(dataCollection.courses);
    });
};

// ✅ Get Student by Student Number
const getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized.");
            return;
        }

        const student = dataCollection.students.find(student => student.studentNum == num);
        if (!student) {
            reject("Student not found.");
            return;
        }

        resolve(student);
    });
};

// ✅ Get Students by Course
const getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized.");
            return;
        }

        const filteredStudents = dataCollection.students.filter(student => student.course == course);
        if (filteredStudents.length === 0) {
            reject("No students found for this course.");
            return;
        }

        resolve(filteredStudents);
    });
};

// ✅ Add a New Student (ONLY in Memory, No File Writing)
const addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized.");
            return;
        }

        // Ensure TA checkbox value is stored as true/false
        studentData.TA = studentData.TA ? true : false;

        // Assign a unique student number
        studentData.studentNum = dataCollection.students.length + 1;

        // ✅ Add to in-memory array (NO FILE WRITING)
        dataCollection.students.push(studentData);
        console.log("✅ New student added in-memory:", studentData);
        resolve();
    });
};

// ✅ Export All Functions
module.exports = {
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentByNum,
    getStudentsByCourse,
    addStudent
};
