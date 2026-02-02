const express = require("express");

const app = express();

const PORT = 8000;

const students =[
    {id: 1, name: "Prashant", branch: "CSE"},
    {id: 2, name: "Pacific", branch: "ECE"},
    {id: 3, name: "Sohan", branch: "IT"}
]

app.get("/",(req,res)=>{
    res.send("Welcome to the home Page")
})

app.get("/students",(req,res)=>{
    const branch = req.query.branch;
    const foundStudents= students.filter(s=>s.branch==branch);
    res.json(foundStudents)
    // res.json(students)
})

app.get("/students/:id",(req,res)=>{
    const id = parseInt(req.params.id)
    const arrayIndex = students.findIndex(s=>s.id==id);
    const data = students[arrayIndex];
    res.json(data)
})
app.get("/user",(req,res)=>{
    res.send("<h1> This is User Page </h1>")
})

app.get("/user/:id",(req,res)=>{
    const userId = req.params.id
    res.send(`You are requesting for user ${userId}`)
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port:${PORT}`)
})