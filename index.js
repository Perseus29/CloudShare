const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const cron = require('node-cron');
const app = express();
const fs = require('fs');
const File = require('./models/file');
const port = process.env.port || 4000;

app.use(express.json())
//Template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// MongoDb Connection
mongoose.connect(process.env.db_url)
    .then(() => {
        console.log("Connected to database");
    }).catch((err) => {
        console.log(err);
    })


// Deletes all records older than 24 hours 
cron.schedule("0 15 * * * *",async function(){
    const pastDate = new Date(Date.now() - 24*60*60*1000);
    const files = await File.find({ createdAt: { $lt: pastDate } });
    if (files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.deleteOne();
                console.log(`successfully deleted ${file.filename}`);
            } catch (err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');    
})



//Routes
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