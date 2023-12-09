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
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.status(200).json(database);
    // console.log(database);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request was recieved`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            review_id: uuid()
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                      writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes!')
                  );
            }
        })

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in adding new note.')
    }
});

app.delete('/api/notes', (req, res) => {

});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});