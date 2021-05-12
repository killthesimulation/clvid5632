const ResetRequest = require('../models/ResetRequest');
const nodemailer = require('nodemailer');


exports.createResetRequest = function (requestId, email) {
    return new Promise((resolve, reject) => {
        const newResetRequest = new ResetRequest({
            requestId,
            email
        });

        newResetRequest.save()
            .then(resetRequest => {
                resolve(resetRequest);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.findResetRequest = function ( requestId ) {
    return new Promise((resolve, reject) => {
        ResetRequest.findOne({ requestId: requestId })
            .then(resetRequest => {
                if(resetRequest){
                    resolve(resetRequest);
                }else{
                    reject("No reset request")
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.sendResetRequest = function (requestId, email) {
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
            to: email,
            subject: 'Password Reset For Clover Country',
            html: `<h1>Password reset</h1><br> You recently requested to reset password for your Clover Citizen Account.<br>Click the link below to reset it.<br>This reset link is only valid for the next 24 hours. <br><br> <a href='https://clovercountry.org/wallet/reset/?password=${requestId}'>Click to reset your password.</a>`
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

