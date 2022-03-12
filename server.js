const fs = require('fs');
const path = require('path');
const express = require('express');
const dbJson = require('./db/db.json');
const uuidv1 = require('uuidv1');
const res = require('express/lib/response');
const { application } = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

//parse incoming array/string data
app.use(express.urlencoded({ extended: true}));
//incoming JSON gets parsed
app.use(express.json());
app.use(express.static("public"));

//API routes
//Setting routes for APIs
app.get('/notes', (re, res) => {
    res.sendFile(path.join(__dirname, '.public/notes.html'));
});

//GET handler to access info on db JSON
app.get('/api/notes', (req, yes) => {
    const notes = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf-8");
    const notesParse = JSON.parse(notes);
    res.json(notesParse);
});

//POST handler to add new notes to db JSON
app.post('/api/notes', (req, yes) => {
    const notes = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf-8");
    const notesParse = JSON.parse(notes);
    req.body.id = uuidv1()
    notesParse.push(req.body);

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesParse), "utf-8");
    res.json("note created!")
});

//WILDCARD handler
app.get('*', (re, res) => {
    res.sendFile(path.join(__dirname, '.public/index.html'));
});

//DELETE note handler
app.delete("/api/notes/:id", function (req, res) {
    console.log(uuidv1())
    console.log("Req.params:", req.params);
    let notesDeleted = parseInt(req.params.id);
    console.log(notesDeleted);

    for (let i = 0; i < dbJson.length; i++) {
        if (notesDeleted === dbJson[i].id) {
            dbJson.splice(i, 1);
    
            let notesJson = JSON.stringify(dbJson, null, 2);
            fs.writeFile("./db/db.json", notesJson, function (err) {
                if (err) throw err;
                console.log("Your note has been deleted!");
                res.json(dbJson);
            });
        }
    }
});     
//

//PORT console display
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}!`);
});