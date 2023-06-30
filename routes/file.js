const router = require('express').Router();
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null,'')
})

router.post('/' , (req,res)=>{
    if(!req.file){
        return res.json({error:"Didn't recieve a file"})
    }
})

module.exports.router;