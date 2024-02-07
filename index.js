import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import cors from 'cors';
import {addNote, getNotes, removeNote, updateNote } from './notes.controller.js';

const port = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(cors())

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: false,
        link: "/login"
    });
});

app.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Login page',
    });
});

app.get('/notes', async (req, res) => {
    const notes = await getNotes()
    res.json(notes)
});

app.post('/', async (req, res) => {
    await addNote(req.body.title);
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: true,
        link: "/login"
    });
});

app.delete('/:id', async (req, res) => {
    console.log('id', req.params.id);
    await removeNote(req.params.id);
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: false
    });
});

app.put('/:id', async (req, res) => {
    await updateNote({ id: req.params.id, title: req.body.title });
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: false
    });
});

app.listen(port, () => {
    console.log(chalk.green(`Server has been started on port ${port}`));
});