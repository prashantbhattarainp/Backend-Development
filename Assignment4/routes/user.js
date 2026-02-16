const express = require("express");
const router = express.Router();

const users = [
  { name:"Prashant" },
  { name:"Pacificl" },
  { name:"Prashna" },
  { name:"Subham" }
];

router.get("/", (req,res)=>{
  const search = req.query.name;

  const filtered = search
    ? users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase()))
    : users;

  res.render("users",{users:filtered, search});
});

module.exports = router;