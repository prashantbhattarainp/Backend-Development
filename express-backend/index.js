const express = require("express");
const app = express();
app.use(express.json()); 

const PORT = 8000;

const students = [
    { id: 1, name: "Prashant", branch: "CSE" },
    { id: 2, name: "Pacific", branch: "ECE" },
    { id: 3, name: "Sohan", branch: "IT" }
];

app.get("/", (req, res) => {
    res.send("Welcome to the home Page");
});

app.get("/students", (req, res) => {
    const branch = req.query.branch;

    if (!branch) {
        res.json(students);
        return;
    }

    res.json(students.filter(s => s.branch === branch));
});

app.get("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        res.send("Student not found");
        return;
    }

    res.json(student);
});

app.post("/students/register", (req, res) => {
    const data = req.body;
    students.push(data);
    res.json(students);
});

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
