// Imports required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helper/uuid');
const database = require('./db/db.json')

// Sets port
const PORT = 3001;

const app = express();

// Sets middleware
app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(_dirname, 'notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.json(database);
    console.log(database);
});

app.post('/api/notes', (req, res) => {

});

app.delete('/api/notes', (req, res) => {

});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});