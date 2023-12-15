const express = require('express');
const fileupload = require("express-fileupload");
const http = require('http')
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(fileupload({ parseNested: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', "./views");

// SQLite database setup
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);


// Create a 'applications' table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY,
        full_name TEXT,
        email TEXT,
        resume_filename TEXT,
        cover_letter TEXT
    )
`);

app.get('/', (req, res) => {
  res.render('index')
});


// API endpoint for submitting job applications
app.post('/apply', (req, res) => {

  console.log(req.body)
  const { first_name, last_name, email, cover_letter } = req.body;

  const full_name = eval(`'${first_name}' + ' ' +'${last_name}'`)

  // Handle file upload (resume)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'Resume file is required.' });
  }

  const resumeFile = req.files.resume;
  const resumeFileName = resumeFile.name;

  // Move the file to the 'public/uploads' directory
  resumeFile.mv(path.join(__dirname, 'uploads', resumeFileName), (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Insert application data into the 'applications' table
    const insertStmt = db.prepare(`
            INSERT INTO applications (full_name, email, resume_filename, cover_letter)
            VALUES (?, ?, ?, ?)
        `);

    insertStmt.run(full_name, email, resumeFileName, cover_letter);
    insertStmt.finalize();

    res.render('success', { full_name })

    // res.json({ message: 'Job application submitted successfully!' });
  });
});

// API endpoint to retrieve job applications
app.get('/applications', (req, res) => {
  db.all("SELECT * FROM applications", (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }

    res.json(rows);
  });
});


// sever starting ...
const server = http.Server(app);
const addr = "0.0.0.0"
const port = 80;
server.listen(port, addr, () => {
  console.log('Server listening on ' + addr + ' port ' + port);
});
