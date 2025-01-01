const mysql = require("mysql2");
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
app.post("/welcome", (req, res) => {
    const { username: loginUser, password: loginPass } = req.body;
    const query = "SELECT * FROM userLogin WHERE user_name = ?";

    connection.query(query, [loginUser], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Some error in Database");
        }

        if (results.length === 0) {
            return res.status(401).send("User not found");
        }

        const user = results[0].user_pass;

        if (user !== loginPass) {
            return res.status(401).send("Wrong Password");
        }

        res.render("welcome.ejs")
    });
});

// Render sign up page
app.get("/sign-up", (req, res) => {
    res.render("signup.ejs");
});

// Handle sign up request
app.post("/sign-up", (req, res) => {
    let { username: signupUser, password: signupPass } = req.body;
    let query = "SELECT * FROM userLogin WHERE user_name = ?";
    connection.query(query, [signupUser], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Some error in Database");
        }

        if (results.length !== 0) {
            return res.status(401).send("Username already exists");
        }

        let q = `INSERT INTO userLogin(user_name, user_pass) VALUES(?,?)`;
        connection.query(q, [signupUser, signupPass], (error, result) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).send("Some error in Databasessss");
            }
            console.log(result);
            res.redirect("/")
        });
    });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
