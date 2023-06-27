const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const port = process.env.port || 4000;


mongoose.connect(process.env.db_url)
    .then(() => {
        console.log("Connected to database");
    }).catch((err) => {
        console.log(err);
    })

app.use('/files' , require('./routes/file'));

app.listen(port, () => {
    console.log(`Connected on port: ${port}`);
});