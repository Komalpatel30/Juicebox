const PORT = 3000;
const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));


const { client } = require('./db');
client.connect();
const apiRouter = require('./api');

server.use('/api', apiRouter);

server.use('/api', (req, res, next) => {
    console.log("A request was made to /api");
    next();
});

// server.get('/api/users', (req, res, next) => {
//     console.log("A get request was made to /api");
//     res.send({ message: "success" });
// });


server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});