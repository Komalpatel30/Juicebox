// api/users.js
const express = require('express');
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");

    next(); // THIS IS DIFFERENT
});

// NEW
const { getAllUsers } = require('../db');

// UPDATE
usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

module.exports = usersRouter;