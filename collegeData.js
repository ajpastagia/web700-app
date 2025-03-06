const fs = require("fs");
const path = require("path");

// ✅ Define absolute paths for JSON files
const studentsFilePath = path.join(__dirname, "data", "students.json");
const coursesFilePath = path.join(__dirname, "data", "courses.json");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// ✅ Initialize Data by Reading JSON Files
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(coursesFilePath, "utf8", (err, courseData) => {
            if (err) {
                reject("Unable to load courses");
                return;
            }

            fs.readFile(studentsFilePath, "utf8", (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                console.log("✅ Data initialized successfully.");
                resolve();
            });
        });
    });
};

// ✅ Function to check if data is initialized
module.exports.isInitialized = function () {
    return dataCollection !== null;
};

// ✅ Get All Students
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data is still loading. Try again later.");
            return;
        }
        if (dataCollection.students.length === 0) {
            reject("Query returned 0 results");
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
        if (filteredStudents.length === 0) {
            reject("Query returned 0 results");
            return;
        }

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
        if (dataCollection.courses.length === 0) {
            reject("Query returned 0 results");
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
        if (!student) {
            reject("Query returned 0 results");
            return;
        }

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
        if (filteredStudents.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

// ✅ Function to Add a New Student and Save to `students.json`
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("Data not initialized");
            return;
        }

        // Ensure TA checkbox value is stored as true/false
        studentData.TA = studentData.TA ? true : false;

        // Assign a unique student number
        studentData.studentNum = dataCollection.students.length + 1;

        // Add new student to the students array in memory
        dataCollection.students.push(studentData);

        // Write updated students array back to `students.json`
        fs.writeFile(studentsFilePath, JSON.stringify(dataCollection.students, null, 4), "utf8", (err) => {
            if (err) {
                reject("Unable to write to students.json: " + err);
            } else {
                resolve();
            }
        });
    });
};
