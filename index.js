const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.port || 4000;

app.use(express.json())
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'))


mongoose.connect(process.env.db_url)
    .then(() => {
        console.log("Connected to database");
    }).catch((err) => {
        console.log(err);
    })


app.get('/', (req, res) => {
    res.render('home');
});
app.use('/api/files', require('./routes/file'));
app.use('/files', require('./routes/view'));
app.use('/files/download', require('./routes/download'));

app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
  });


app.listen(port, () => {
    console.log(`Connected on port: ${port}`);
});