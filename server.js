// Imports required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helper/uuid');
const database = require('./db/db.json')

// Sets port
const PORT = process.env.PORT || 3001;

const app = express();

// Sets middleware
app.use(express.json());
app.use(express.static('public'));

// GET method for the homepage navigation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET method to navigate to the page ending in /notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

// GET method for viewing specific notes based on provided ID
app.get('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err,data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data)
            const activeNote = parsedNotes.find((obj) => obj.id === noteId);
            console.log(activeNote);

            return activeNote;
        };
    });
});

// GET method to read db.json and return saved notes as json
app.get('/api/notes', (req, res) => {
    res.status(200).json(database);
    // console.log(database);
});

// Allows POST method to notes
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request was recieved`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
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

// Allow DELETE method to notes
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err,data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data)
            const deletedNote = parsedNotes.find((obj) => obj.id === noteId);
            console.log(deletedNote);

            const newParsedNotes = parsedNotes.filter((element) => element !== deletedNote);
            console.log(newParsedNotes);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(newParsedNotes, null, 4),
                (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
              );
        }
    })


});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});