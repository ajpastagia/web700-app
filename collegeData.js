const fs = require("fs");
const path = require("path");

// ✅ Define paths for JSON files
const studentsFilePath = path.join(__dirname, "data", "students.json");
const coursesFilePath = path.join(__dirname, "data", "courses.json");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// ✅ Initialize Data (Read JSON Files)
function initialize() {
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
                console.log("✅ Data successfully loaded.");
                resolve();
            });
        });
    });
}

// ✅ Export functions properly
module.exports = {
    initialize,
    getAllStudents: function () {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.students);
        });
    },
    getTAs: function () {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.students.filter(student => student.TA === true));
        });
    },
    getCourses: function () {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.courses);
        });
    },
    getStudentByNum: function (num) {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.students.find(student => student.studentNum == num));
        });
    },
    getStudentsByCourse: function (course) {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }
            resolve(dataCollection.students.filter(student => student.course == course));
        });
    },
    addStudent: function (studentData) {
        return new Promise((resolve, reject) => {
            if (!dataCollection) {
                reject("Data not initialized");
                return;
            }

            studentData.TA = studentData.TA ? true : false;
            studentData.studentNum = dataCollection.students.length + 1;
            dataCollection.students.push(studentData);
            resolve();
        });
    }
};
