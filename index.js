// const mysql = require("mysql2");
const path = require("path");
const express = require("express");
const app = express();

// Middleware for serving static files and parsing requests
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MySQL Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "loginSystem",
    password: "Vish@l@2356",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
    console.log("Connected to the database successfully");
});

// Render login page
app.get("/", (req, res) => {
    res.render("login.ejs");
});

// Handle login request
app.post("/", (req, res) => {
    const { username: formUser, password: formPass } = req.body;
    const query = "SELECT * FROM userLogin WHERE user_name = ?";

    connection.query(query, [formUser], async(err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Some error in Database");
        }

        if (results.length === 0) {
            return res.status(401).send("User not found");
        }

        const user = results[0].user_pass;
        
        if (user !== formPass) {
            return res.status(401).send("Wrong Password");
        }

        res.redirect("/welcome");
    });
});

// Render welcome page
app.get("/welcome", (req, res) => {
    res.render("welcome.ejs");
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
