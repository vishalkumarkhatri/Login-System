const mysql = require("mysql2");
const express = require("express");


const app = express();
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "loginSystem",
    password: "Vish@l@2356",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database successfully");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    let { username, password } = req.body;
    let q = `SELECT * FROM userLogin WHERE user_name = "${username}" AND user_pass = "${password}"`;
    connection.query(q, (err, result) => {
        if (result.length > 0) {
            res.redirect("/welcome")
        } else {
            res.redirect("/")
        }
        res.end();
    });
});

app.get("/welcome", (req, res) => {
    res.sendFile(__dirname + "/welcome.html");
});

app.listen("8080", () => {
    console.log("Listen in port 8080");
});