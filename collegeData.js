const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("query returned 0 results");
            return;
        }
        resolve(dataCollection.students);
    });
};

module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(student => student.TA === true);

        if (filteredStudents.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("query returned 0 results");
            return;
        }
        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(student => student.studentNum == num);

        if (!student) {
            reject("query returned 0 results");
            return;
        }

        resolve(student);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(student => student.course == course);

        if (filteredStudents.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

const path = require("path");

const filePath = path.join(__dirname, "data", "students.json");

// ✅ Function to Add a New Student and Save to `students.json`
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("Data not initialized");
            return;
        }

        // Ensure TA checkbox value is correctly stored as true or false
        studentData.TA = studentData.TA ? true : false;

        // Assign a unique student number
        studentData.studentNum = dataCollection.students.length + 1;

        // Add new student to the students array in memory
        dataCollection.students.push(studentData);

        // Write updated students array back to `students.json`
        fs.writeFile(filePath, JSON.stringify(dataCollection.students, null, 4), "utf8", (err) => {
            if (err) {
                reject("Unable to write to students.json: " + err);
            } else {
                resolve();
            }
        });
    });
};

