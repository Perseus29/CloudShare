const router = require('express').Router();
const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null,'Files/'),
    filename: (req,file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);   
    }
})

let upload = multer({
    storage: storage,
    limit : { fileSize : 104857600 },

}).single('uploadFile');

router.post('/' , (req,res)=>{
    if(!req.file){
        return res.json({error:"Didn't recieve a file"})
    }
})

module.exports.router;