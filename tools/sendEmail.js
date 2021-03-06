const nodemailer = require('nodemailer');

exports.sendEmailExcel = function (fileName) {
    return new Promise((resolve, reject) => {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
    
        const mailOptions = {
            from: process.env.EMAIL,
            to: 'citizens@clovercountry.org',
            subject: 'Clover Excel Export',
            html: '',
            attachments: [{
                filename: fileName,
                path: __dirname + '/outputFiles/' + fileName
            }]
        }
    
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                console.log('Email send')
                resolve('Email send');
            }
        })

    })
}



exports.sendEmailTest = function () {
    return new Promise((resolve, reject) => {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
    
        const mailOptions = {
            name: 'Consultation',
            address: 'kattycolins@newyork.com',
            to: 'newaliveme@icloud.com',
            subject: 'Account #78342',
            html: 'Hello! Your results are impressive!',
            attachments: ''
        }
    
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                console.log('Email send')
                resolve('Email send');
            }
        })

    })
}