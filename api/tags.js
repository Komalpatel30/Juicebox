// api/tags.js
const express = require('express');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next(); // THIS IS DIFFERENT
});

// NEW
const { getAllTags } = require('../db');

// UPDATE
tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

module.exports = tagsRouter;