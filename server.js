const express = require('express');
const app = express();
const port = 8080;
const database = require('./database')

app.use(express.json());
app.use(express.static('public'));
 
//Gets admin by name
app.get('/admins/:name', (req,res) => {
    const {name} = req.params;
    database.query('SELECT * FROM admins WHERE name = ?', [name], (err, results) => {
        if (err) {
            console.log("Error fetching admin: ", err);
            response.status(500).send("Server Error: Status 500");
            return;
        }
        if (results.length === 0){
            res.status(404).send("Admin not found");
            return;
        }
        res.json(results[0]);
    });
});

//Gets all clients
app.get('/clients', (req, res) => {
    database.query('Select * FROM clients', (err, results) => {
        if (err){
            console.log("Error fetching clients: ", err);
            response.status(500).send("Server Error: Status 500");
            return;
        }
        res.json(results);
    });
});
//Gets a specific client by name
app.get('/clients/:name', (req, res) => {
    const {name} = req.params;
    database.query('SELECT * FROM clients WHERE name = ?', [name], (err, results) => {
        if (err){
            console.error('Error fetching client:', err);
            res.status(500).send('Server Error');
            return;
        }
        if (results.length === 0){
            res.status(404).send('Client not found');
            return;
        }
        res.json(results[0]);
    });
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home.html'); // Serve the home page
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});