const cors = require("cors");
const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");
const cookieparser = require("cookie-parser");

// Setup Corse and DB
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
// Create a table setup in the database if table does not exists
let sql = `CREATE TABLE IF NOT EXISTS "USER" ( ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                                              Username text NOT NULL UNIQUE,
                                              Password text NOT NULL,
                                              sessionToken TEXT);
                                              
          CREATE TABLE IF NOT EXISTS "PRODUCT" ( ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                                              ProductName text NOT NULL, 
                                              PictureUrl BLOB NOT NULL);

          CREATE TABLE IF NOT EXISTS "ORDER" ( OrderID INTEGER PRIMARY KEY AUTOINCREMENT, 
                                              ProductID INTEGER NOT NULL REFERENCES PRODUCT(ID) ON DELETE CASCADE,
                                              UserID Integer NOT NULL REFERENCES USER(ID) ON DELETE CASCADE);`;

// Connect to existing Database
const db = new sqlite3.Database("db.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Make db queries return a promise
db.get = promisify(db.get.bind(db));
db.run = promisify(db.run.bind(db));
db.all = promisify(db.all.bind(db));

db.exec(sql);
//Express API
app.get("/", (req, res) => {
  db.all("SELECT * FROM USER", (err, result) => {
    if (err) {
      console.error(err);
    }
    res.json(result);
  });
});

//Login endpoint async
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const user = await db.get(
      'SELECT "ID", "Username" FROM USER WHERE Username = ? AND Password = ?',
      [username, password],
    );
    if (!user) {
      return res.status(401).json({
        message: "Invalid Username or Password",
      });
    }

    console.log("user: ", user.ID);
    const token = Math.random().toString(36).substring(2);

    try {
      await db.run("UPDATE USER SET sessionToken = ? WHERE ID = ?", [
        token,
        user.ID,
      ]);
    } catch (error) {
      console.error("Failed to update session token:", error);
      return res.status(500).json({
        message: "Login failed",
      });
    }

    res.cookie("sessionToken", token, {
      //only for development
      secure: false,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      username: user.Username,
      message: "Login Successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
    });
  }
});

app.post("/signup/", async (req, res) => {
  const newUser = req.body;

  try {
    const row = await db.get(`SELECT Username FROM USER WHERE Username = ?`, [
      newUser.username,
    ]);

    if (row) {
      return res.json({ message: "Username is taken." });
    }

    const result = await db.run(
      "INSERT INTO USER (Username, Password) VALUES (?,?)",
      [newUser.username, newUser.password],
    );

    res.json({ message: "Registered Successfully" });
  } catch (error) {
    console.error("Signup Error: ", error);
    return res.status(500).json({ message: "Registration Failed" });
  }
});

app.get("/user/shop", (req, res) => {});

app.post("/user/shop", (req, res) => {});

app.delete("/user/shop", (req, res) => {});

app.get("/profile", (req, res) => {
  const token = req.cookies.sessionToken; // ✅ Now works

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  db.get(
    "SELECT Username FROM USER WHERE sessionToken = ?",
    [token],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "Invalid session" });
      }

      res.json({ username: user.Username });
    },
  );
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
