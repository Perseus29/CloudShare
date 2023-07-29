const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'files/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage: storage,
    limit: { fileSize: 104857600 },

}).single('uploadFile');

router.post('/', (req, res) => {


    // Store file
    upload(req, res, async (err) => {
        // Validate request
        if (!req.file) {
            return res.json({ error: "Didn't recieve a file" })
        }

        if (err) {
            return res.status(500).send({ error: err.message });
        }

        // Store into Database
        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuid4()
        });

        const response = await file.save();

        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    });

})

router.post('/send', async (req, res) => {
    const { uuid, recieverEmail, senderEmail } = req.body;

    //validate request
    if (!uuid || !recieverEmail || !senderEmail) {
        return res.status(422).send({ error: "All fields are required1!" });
    }

    // Get data from database 
    const file = await File.findOne({ uuid: uuid });

    if(!file){
        return res.json({error : "Link has been expired"});
    }

    file.sender = senderEmail;
    file.receiver = recieverEmail;

    const data = await file.save();

    // send mail
    const sendMail = require('../services/email');

    sendMail({
        senderEmail : senderEmail,
        recieverEmail : recieverEmail,
        subject : "CloudShare file sharing",
        text : `${senderEmail} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom : senderEmail,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1024) + ' KB',
            expires: '24 hours'
        })
    })

    return res.send({success : true});

})

module.exports = router;