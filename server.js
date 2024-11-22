const express = require('express');
const app = express();
const port = 8080;
const database = require('./database');
const session = require('express-session'); // Import express-session

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(express.static('public'));

// Configure express-session
app.use(session({
  secret: 'a-secret-key-to-encrypt-session-data',
  resave: false, // Do not save session if unmodified
  saveUninitialized: false, // Do not create session until something stored
  cookie: { secure: false } // Set to true if using HTTPS
}));

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
    } else {
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

// Client login
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
        req.session.user = results[0]; // Set the session user
        res.redirect('/client-homepage.html');
      } else {
        res.status(400).send("Incorrect password");
      }
    } else {
      res.status(404).send("Client not found");
    }
  });
});

app.post('/admin-login.html', (req, res) => {
  const { name, password } = req.body;

  database.query('SELECT * FROM admins WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.log("Error checking for existing client: ", err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    if (results.length > 0) {
      if (results[0].password === password) {
        req.session.user = results[0]; // Set the session user
        res.redirect('/admin-homepage.html');
      } else {
        res.status(400).send("Incorrect password");
      }
    } else {
      res.status(404).send("Admin not found");
    }
  });
});

// Endpoint to fetch session details
app.get('/session-details', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).send("No active session");
  }
});

// Gets all orders for a specific user
app.get('/orders/:clientID', (req, res) => {
  const { clientID } = req.params;
  database.query('SELECT * FROM orders WHERE clientID = ?', [clientID], (err, results) => {
    if (err) {
      console.log("Error fetching orders: ", err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("No orders found for this user");
      return;
    }
    res.json(results);
  });
});

// Serve the sign-up page
app.get('/sign-up', (req, res) => {
  res.sendFile(__dirname + '/public/sign-up.html');
});

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});