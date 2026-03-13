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
                                              Password text NOT NULL);
                                              
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

app.get("/db/", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  db.get(
    `SELECT Username FROM USER WHERE Username = ? and Password = ?`,
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err.message);
      } else if (row) {
        res.send("Logged In");
      } else {
        res.send("Invalid Username or Password");
      }
    },
  );
});

app.post("/db/", (req, res) => {
  const newUser = req.body;

  // Check If username is already taken if not register
  function checkUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT Username FROM USER WHERE Username = ?`,
        [username],
        (err, row) => {
          if (err) {
            reject(err.message);
          } else if (row) {
            resolve("Username taken");
          } else {
            // If not register new user
            db.run(
              "INSERT INTO USER (ID, Username, Password) VALUES (?, ?, ?)",
              [1, newUser.Username, newUser.Password],
              function (err) {
                if (err) {
                  console.error(err.message);
                }
              },
            );
            resolve("Registered");
          }
        },
      );
    });
  }

  // Check if username is already taken
  checkUsername(newUser.Username)
    .then((result) => res.send(result)) // Output: "Username taken" or "Username available"
    .catch((err) => res.send(err));
});

app.get("/user/shop", (req, res) => {});

app.post("/user/shop", (req, res) => {});

app.delete("/user/shop", (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
