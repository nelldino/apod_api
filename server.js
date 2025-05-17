const express = require ('express');
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/routes.js')(app, fs);

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

