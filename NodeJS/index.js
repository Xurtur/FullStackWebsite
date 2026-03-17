const cors = require("cors");
const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();

// Setup Corse and DB
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a table setup in the database if table does not exists
let sql = `CREATE TABLE IF NOT EXISTS "USER" ( ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                                              Username text NOT NULL UNIQUE,
                                              Password text NOT NULL
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

app.post("/login/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ message: "Invalid Username or Password" });
  }
  try {
    const user = await db.get(
      `SELECT id, Username FROM USER WHERE Username = ? and Password = ?`,
      [username, password],
    );

    if (!user) {
      return res.json({ message: "Invalid Username or Password" });
    }

    const token = Math.random().toString(36).substring(2);

    const startSession = await db.run(
      "UPDATE USER SET sessionToken = ? WHERE Id= ?",
      [token, user.id],
    );

    return res.json({
      token,
      username: user.username,
      message: "Login Successful",
    });
  } catch (error) {
    console.error("Error:", error);
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
