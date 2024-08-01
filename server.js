const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Serve the index.html file when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let todos = [];

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const newTodo = req.body;
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.delete('/todos/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < todos.length) {
        todos.splice(index, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.put('/todos/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < todos.length) {
        todos[index] = { ...todos[index], ...req.body };
        res.json(todos[index]);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
