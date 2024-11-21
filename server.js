const express = require('express');
const app = express();
const port = 8080;
const database = require('./database');
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(express.static('public'));

// Gets admin by name
app.get('/admins/:name', (req, res) => {
  const { name } = req.params;
  database.query('SELECT * FROM admins WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.log("Error fetching admin: ", err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Admin not found");
      return;
    }
    res.json(results[0]);
  });
});

// Gets all clients
app.get('/clients', (req, res) => {
  database.query('SELECT * FROM clients', (err, results) => {
    if (err) {
      console.log("Error fetching clients: ", err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    res.json(results);
  });
});

// Add a new client
app.post('/sign-up.html', (req, res) => {
  const { name, password, address, phone, email } = req.body;
  const client = {
    name: name,
    password: password,
    address: address,
    phone: phone,
    email: email,
    services: JSON.stringify([]), // Ensure these fields are valid JSON strings
    services_complete: JSON.stringify([]),
    services_upcoming: JSON.stringify([])
  };
    database.query('SELECT * FROM clients WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.log("Error checking for existing client: ", err);
            res.status(500).send("Server Error: Status 500");
            return;
        }
        if (results.length > 0) {
            res.status(400).send("Client with this email already exists");
            return;
        }
        else {
            database.query("INSERT INTO clients SET ?", client, (err, result) => {
                if (err) {
                    console.log("Error adding client: ", err);
                    res.status(500).send("Server Error: Status 500");
                    return;
                }
                res.redirect('/sign-up-success.html');
            });
        }
    });
});

app.post('/client-login.html', (req, res) => {
    const { email, password } = req.body;

        database.query('SELECT * FROM clients WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.log("Error checking for existing client: ", err);
                res.status(500).send("Server Error: Status 500");
                return;
            }
            if (results.length > 0) {
                if (results[0].password === password) {
                    app.use(session({ secret: "a-secret-key-to-encrypt-session-data" }));
                    app.get("/setSession", (request, response) => {
                            request.session.user = results[0];
                    });
                    res.redirect('/client-homepage.html');
                }
                else {
                    res.status(400).send("Incorrect password");
                }
            }
            else {
                res.status(400).send("Incorrect password");
            }
        });
});

app.get("/client-homepage.js", (request, response) => {
    const user = request.session.user;
    response.send(user);
  });

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});