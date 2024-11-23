const express = require('express');
const app = express();
const port = 8080;
const database = require('./database');
const session = require('express-session'); // Import express-session
const fs = require('fs');
const path = require('path');

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

app.get('/clients/:id', (req, res) => {
  const {id} = req.params;
  database.query('SELECT * FROM clients WHERE id = ?', [id], (err, results) => {
    if(err){
      console.log("Error checking for existing client: ", err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    res.json(results[0]);
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
      // If a client with the same email exists
      res.status(400).send("Client with this email already exists");
    } else {
      // Insert new client into the database
      database.query(
        "INSERT INTO clients (name, password, address, phone, email) VALUES (?, ?, ?, ?, ?)",
        [name, password, address, phone, email],
        (err, result) => {
          if (err) {
            console.log("Error adding client: ", err);
            res.status(500).send("Server Error: Status 500");
          } else {
            res.redirect('/sign-up-success.html'); // Redirect to a success page
          }
        }
      );
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
      const user = results[0];

      // Compare plain-text passwords
      if (user.password === password) {
        req.session.user = user; // Store user in the session
        res.redirect('/client-homepage.html'); // Redirect to the homepage
      } else {
        res.status(400).send("Incorrect password");
      }
    } else {
      res.status(404).send("Client not found");
    }
  });
});

// client update info
app.put('/clients/:id', (req, res) => {
  const { id } = req.params;
  const { name, address, phone, password } = req.body;

  if (!name || !address || !phone || !password) {
      return res.status(400).send("All fields are required.");
  }

  const query = 'UPDATE clients SET name = ?, address = ?, phone = ?, password = ? WHERE id = ?';
  database.query(query, [name, address, phone, password, id], (err, result) => {
      if (err) {
          console.error("Error updating client:", err);
          return res.status(500).send("Server Error");
      }
      if (result.affectedRows === 0) {
          return res.status(404).send("Client not found.");
      }
      req.session.user.name = name;
      res.sendStatus(200); // Update successful
  });
});

//delete client
app.delete('/clients/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM clients WHERE id = ?';
  database.query(query, [id], (err, result) => {
      if (err) {
          console.error("Error deleting client:", err);
          return res.status(500).send("Server Error");
      }
      if (result.affectedRows === 0) {
          return res.status(404).send("Client not found.");
      }
      res.sendStatus(200); // Deletion successful
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
// Fetch upcoming services (status 1), unpaid services (status 2), past services (status 3)
app.get('/orders/:clientID/:status', (req, res) => {
  const { clientID, status } = req.params;
  const query = `
    SELECT orders.id, orders.clientID, orders.order_date, orders.completion_date, orders.status, services.name, services.price
    FROM orders
    JOIN services ON orders.serviceID = services.id
    WHERE orders.clientID = ? AND orders.status = ?
  `;
  database.query(query, [clientID, status], (err, results) => {
    if (err) {
      console.log("Error fetching orders: ", err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    res.json(results);
  });
});

//Update order status
app.post('/orders/:orderID/status', (req, res) => {
  const { orderID } = req.params;
  const { status } = req.body;
  database.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderID], (err, results) => {
    if (err) {
      console.log("Error updating order status: ", err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
  res.sendStatus(200);
  });
});

//Get all services
app.get('/services', (req,res) =>{
  database.query('SELECT * FROM services', (err,results) =>{
    if(err){
      console.log('Error fetching services', err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    res.json(results);
  });
});

app.get('/api/services', (req, res) => {
  const query = 'SELECT * FROM services WHERE active = 1';
  database.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching active services:", err);
          return res.status(500).send("Server Error");
      }
      res.json(results); // Return active services
  });
});

// Fetch active services for display
app.get('/api/services/active', (req, res) => {
  const query = 'SELECT * FROM services WHERE active = 1';
  database.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching active services:", err);
          res.status(500).send("Server Error");
          return;
      }
      res.json(results); // Return active services
  });
});

//insert new service
app.post('/api/services', (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || !description) {
    return res.status(400).send("All fields are required");
  }

  const query = 'INSERT INTO services (name, price, description) VALUES (?, ?, ?)';
  database.query(query, [name, price, description], (err, result) => {
    if (err) {
      console.log("Error adding service: ", err);
      res.status(500).send("Server Error");
      return;
    }
    res.sendStatus(201); // Service added successfully
  });
});

app.put('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  if (!name || !price || !description) {
      return res.status(400).send("All fields are required!");
  }

  const query = 'UPDATE services SET name = ?, price = ?, description = ? WHERE id = ?';
  database.query(query, [name, price, description, id], (err, result) => {
      if (err) {
          console.error("Error updating service:", err);
          return res.status(500).send("Server Error");
      }
      if (result.affectedRows === 0) {
          return res.status(404).send("Service not found");
      }
      res.sendStatus(200); // Update successful
  });
});

// Fetch discontinued services
app.get('/api/services/discontinued', (req, res) => {
  const query = 'SELECT * FROM services WHERE active = 0';
  database.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching discontinued services:", err);
          return res.status(500).send("Server Error");
      }
      res.json(results); // Return discontinued services
  });
});

// Deactivate a service (move to discontinued)
app.put('/api/services/:id/deactivate', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE services SET active = 0 WHERE id = ?';
  database.query(query, [id], (err, result) => {
      if (err) {
          console.error("Error deactivating service:", err);
          return res.status(500).send("Server Error");
      }
      if (result.affectedRows === 0) {
          return res.status(404).send("Service not found");
      }
      res.sendStatus(200); // Deactivation successful
  });
});

// Reactivate a discontinued service
app.put('/api/services/:id/reactivate', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name || !price) {
      return res.status(400).send("Both name and price are required!");
  }

  const query = 'UPDATE services SET name = ?, price = ?, active = 1 WHERE id = ?';
  database.query(query, [name, price, id], (err, result) => {
      if (err) {
          console.error("Error reactivating service:", err);
          return res.status(500).send("Server Error");
      }
      if (result.affectedRows === 0) {
          return res.status(404).send("Service not found");
      }
      res.sendStatus(200); // Reactivation successful
  });
});


//Fetch service by id
app.get('/services/:id', (req,res) =>{
  const {id} = req.params;
  database.query('SELECT * FROM services WHERE id = ?', [id], (err,results) =>{
    if(err){
      console.log('Error fetching service: ', err);
      res.status(500).send("Server Error: Status 500");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Service not found");
      return;
    }
    res.json(results);
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

/*app.post('/session-details/:billID', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).send("No active session");
  }
});*/

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

// API to fetch business info
app.get('/api/business-info', (req, res) => {
  const filePath = path.join(__dirname, 'business-info.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error("Error reading business info file:", err);
          return res.status(500).json({ error: "Failed to read business info" });
      }

      const lines = data.split('\n').map(line => line.trim());
      const name = lines[0] || "Unknown Business Name";
      const address = lines[1] || "Unknown Address";
      const phone = lines[2] || "0000000000";

      res.json({ name, address, phone });
  });
});

app.post('/api/business-info', (req, res) => {
  const { name, address, phone } = req.body;

  // Basic input validation
  if (!name || !address || !phone || phone.length < 10 || isNaN(phone)) {
      return res.status(400).json({ error: "Invalid input. All fields are required and phone must be numeric." });
  }

  const filePath = path.join(__dirname, 'business-info.txt');
  const updatedData = `${name}\n${address}\n${phone}`;
  
  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
          console.error("Error writing to business info file:", err);
          return res.status(500).json({ error: "Failed to update business info" });
      }

      res.json({ message: "Business info updated successfully" });
  });
});

// Add a new order
app.post('/api/orders', (req, res) => {
  const { clientID, serviceID, order_date, completion_date, status } = req.body;

  if (!clientID || !serviceID || !order_date || !completion_date || !status) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
      INSERT INTO orders (clientID, serviceID, order_date, completion_date, status)
      VALUES (?, ?, ?, ?, ?)
  `;
  database.query(query, [clientID, serviceID, order_date, completion_date, status], (err, result) => {
      if (err) {
          console.error('Error creating new order:', err);
          return res.status(500).json({ error: 'Failed to create new order' });
      }
      res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
  });
});
