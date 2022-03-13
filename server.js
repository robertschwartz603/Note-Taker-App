const fs = require('fs');
const path = require('path');
const express = require('express');
const dbJSON = require('./db/db.json');
const { v4: uuidv4} = require('uuid');
//const res = require('express/lib/response');
const PORT = process.env.PORT || 3001;
const app = express();

//parse incoming array/string data
app.use(express.urlencoded({ extended: true}));
//incoming JSON gets parsed
app.use(express.json());
app.use(express.static("public"));

//API routes
//Setting routes for APIs
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//GET handler to access info on db JSON
app.get('/api/notes', (req, res) => {
    const notes = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf-8");
    const notesParse = JSON.parse(notes);
    res.json(notesParse);
});

//POST handler to add new notes to db JSON
app.post('/api/notes', (req, res) => {
    const notes = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf-8");
    const notesParse = JSON.parse(notes);
    req.body.id = uuidv4()
    notesParse.push(req.body);

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesParse), "utf-8");
    res.json("note created!")
});

//WILDCARD handler
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//DELETE function - could not get to work. iceboxed
app.delete("/api/notes/:id", function (req, res) {
    console.log(uuidv4())
    console.log("Req.params:", req.params);
    const { parse: uuidParse } = require('uuid');
    let notesDeleted = parseInt(req.params.id);
    console.log(notesDeleted);

    for (let i = 0; i < dbJSON.length; i++) {
        //console.log(dbJSON);
        console.log(dbJSON[i]);
        if (notesDeleted === uuidParse(dbJSON[i].id)) {
            dbJSON.splice(i, 1);
            //dbJSON = dbJSON.splice(i, 1);
            console.log("howdy this works");

            let notesJson = JSON.stringify(dbJSON, null, 2);
            console.log(notesJson);
            fs.writeFile("./db/db.json", notesJson, function (err) {
                if (err) throw err;
                console.log("Your note has been deleted!");
                res.json(dbJSON);
            });
        }
    }
});     
//PORT console display
app.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`);
});