const db = require('../models/model');
const sequelize = require('sequelize');
const axios = require("axios");
const config = require('../../config/config.json');
var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(config.emailSettings.itIsGmail ?
    {
        service: 'gmail',
        auth: {
            user: config.emailSettings.email,
            pass: config.emailSettings.password
        }
    } :
    {
        name: config.emailSettings.name,
        host: config.emailSettings.host,//"mail.chickenman.net.au",
        port: config.emailSettings.port,//465,
        secure: config.emailSettings.secure, // true for 465, false for other ports
        auth: {
            user: config.emailSettings.email,//"no-reply@chickenman.net.au", //example of generated by Mailtrap
            pass: config.emailSettings.password,//"@chicken_man@no-reply" //example of generated by Mailtrap
        },
        tls: {
            rejectUnauthorized: false
        }
    }
);

module.exports.sendMail = async (mail, req) => {
    return new Promise(async (resolve, reject) => {
        mail.Date = new Date();
        mail.MailTotal = mail.To.length;
        mail.MailTo = JSON.stringify(mail.To);
        mail.userId = req.currentUser;
        var mailOptions = {
            from: [{ name: config.emailSettings.name, address: config.emailSettings.email }], // sender address
            bcc: mail.To,
            subject: mail.MailSubject,
            text: mail.MailBody,
            html: mail.MailBody//'<b>Hey there! </b><br> This is our first message sent with Nodemailer'
        };

        transport.verify(function (error, success) {
            if (error) {
                console.log("Error: " + error);
                reject({
                    status: 303,
                    message: error
                });
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({
                    status: 303,
                    message: error
                });
            }
            else if (info) {
                console.log('Email sent: ' + info.response)
                resolve({
                    status: 200,
                    message: 'Email sent: ' + info.response
                });
            }
        });
    });
}