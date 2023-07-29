const nodemailer = require('nodemailer');

async function sendMail({senderEmail , recieverEmail , subject , text , html}){
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth:{
            user: process.env.MAIL_USER ,
            pass: process.env.MAIL_PASS
        }
    })

    let info = await transporter.sendMail({
        from : `CloudShare <${senderEmail}>`,
        to : recieverEmail,
        subject,
        text,
        html
    });
}

module.exports = sendMail;