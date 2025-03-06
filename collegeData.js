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

// ✅ Initialize Data
module.exports.initialize = function () {
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

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                console.log("✅ Data successfully loaded.");
                resolve();
            });
        });
    });
};

// ✅ Get All Students
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
            return;
        }
        resolve(dataCollection.students);
    });
};

// ✅ Get Teaching Assistants (TAs)
module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
            return;
        }

        const filteredStudents = dataCollection.students.filter(student => student.TA === true);
        resolve(filteredStudents);
    });
};

// ✅ Get All Courses
module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
            return;
        }
        resolve(dataCollection.courses);
    });
};

// ✅ Get Student by Student Number
module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
            return;
        }

        const student = dataCollection.students.find(student => student.studentNum == num);
        resolve(student);
    });
};

// ✅ Get Students by Course
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
            return;
        }

        const filteredStudents = dataCollection.students.filter(student => student.course == course);
        resolve(filteredStudents);
    });
};

// ✅ Add a New Student
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
            return;
        }

        studentData.TA = studentData.TA ? true : false;
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);

        fs.writeFile(studentsFilePath, JSON.stringify(dataCollection.students, null, 4), "utf8", (err) => {
            if (err) reject("Error writing to students.json: " + err);
            else resolve();
        });
    });
};
