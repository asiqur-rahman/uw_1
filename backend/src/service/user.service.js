const db = require('../models/model');
var path = require('path');
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');
const emailService = require('../externalService/email.service');
const fileService = require('../controllers/api.controllers/file.controller');
const appConfig = require('../../config/config.json');
const otpGenerator = require('otp-generator');

const service = {};

service.getById = async (id,req) => {
    return new Promise(async (resolve, reject) => {
        await db.user.findOne({
            where: {
                id: id
            },
            include: [{
                model: db.role,
                as: "role"
            }],
            raw: true
        }).then(async data => {
            if (data) {
                await db.userPermission.findAll({
                    where: {
                      userId: id
                    },
                    raw: true
                  }).then(result => {
                    data.permissions=[]
                    result.map(function(item){data.permissions.push({permissionId:item.permissionId})})
                    data.files = fileService.getFilesWithLink(data.id,false,req);
                    resolve({status:200,data:data});
                  }).catch(e => {
                    resolve({
                        status: 404,
                        message: "User not found !"
                    })
                  })
            } else {
                resolve({
                    status: 404,
                    message: "User not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            })
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};


service.getByCidScid = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.user.findAll({
            where: {
                [Op.and]: [{
                    categoryId: req.params.cid
                },
                {
                    subCategoryId: req.params.scid
                }]
            },
            include: [{
                model: db.role,
                as: "role"
            }],
            raw: true
        }).then(async data => {
            if (data) {
                resolve({status:200,data:data});
            } else {
                resolve({
                    status: 404,
                    message: "User not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            })
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

service.getByName = async (value) => {
    return new Promise(async (resolve, reject) => {
        await db.user.findOne({
            where: {
                [Op.or]: [{
                    phone: value
                }]
            },
            include: [{
                model: db.role,
                as: "role",
            }],
            raw: true
        }).then(data => {
            if (data) {
                resolve({status:200,data:data});
            } else {
                resolve({
                    status: 404,
                    message: "User not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            })
        });
    })
    .catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

service.getRoleDD =async ()=> {
    return new Promise(async (resolve, reject) => {
        return await db.role.findAll({
            attributes: ['id','name'],
            raw: true
        })
        .then(data => {
            let dd =[];
            data.map(item=>{
                dd.push({label:item.name,value:item.id});
            })
            resolve({status:200,data:dd});
        })
        .catch(function (err) {
            reject({
                status: 303,
                message: err.message
            })
        });
    }); 
};

service.indexData = async (req,roleId) => {
    return new Promise(async (resolve, reject) => {
        await db.user.findAndCountAll({
            where: {
                [Op.and]: [{
                    roleId: roleId??true
                }]
            },
            include: [
                {
                    model: db.role,
                    attributes: ['name'],
                }
            ],
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo.rows) {
                var count = 0;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                    detail.image = fileService.getFilesWithLink(detail.id,"profilePicture",req);
                })
                resolve({status:200,recordsTotal:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
        });
    });
};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await service.getByName(req.body.phone)
        .then(async data => {
            if (data && data.status != 404) {
                resolve({
                    status: 303,
                    message: "User already exists by this phone"
                })
            } else {
                const password=req.body.password??otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                // req.body.password??(Date.now() % 100000000).toString();
                req.body.password = password//await bcrypt.hash(password, 8);
                await db.user.create(req.body).then(async user => {

                    await db.otp.create({userId:user.id,otp:req.body.otp});
                    req.body.permissions.forEach(element => {
                        element.userId = user.id;
                    });
                    await db.userPermission.destroy({
                        where: {
                            [Op.and]: [{
                                userId: user.id
                            }]
                        }
                    }).then(async result => {
                        await db.userPermission.bulkCreate(req.body.permissions);
                    });

                    const link = req.protocol + '://' + req.get('host') + `/api/auth/verification/otp/${user.id}&${req.body.otp}`;
                    if(req.body.emailInvitation){
                        try{
                            await emailService.sendMail({
                                To: [req.body.email],
                                MailSubject: "Account Verification",
                                MailBody: `
                                <div style="padding:10px;border-style: ridge">
                                <p>Please verify your account</p>
                                <h3>Click on the link below to verify your account</h3>
                                <a href="${link}">Click here to verify</a>
                                <p>Or You can copy the link and paste to your browser: ${link} </p>
                                <p>Your login username:  <b>${req.body.phone}</b>  </p>
                                <p>Your login password:  <b>${password}</b>  </p>
                                <br/>
                                <p>Note: Please verify first before login.</p>
                                `
                            },req)
                            .then(function(res){
                                resolve({
                                    status: 201,
                                    id: user.id,
                                    message: 'User was created. With email invitaion.',
                                    invitation: res.message
                                });
                            })
                        }catch (error) {
                            console.log("Email sending error !");
                            console.log(error);
                        }
                    }
                    
                    if(req.body.whatsappInvitation){
                        try {
                            const client = require("twilio")(
                                appConfig.appSettings.TWILIO_ACCOUNT_SID,
                                appConfig.appSettings.TWILIO_AUTH_TOKEN
                            );
                            if(!req.body.phone)
                            resolve({
                                status: 0,
                                message: 'No Phone Number Found for that user.'
                            });
            
                            await client.messages.create({
                                from: `whatsapp:${appConfig.appSettings.Twilio_PhoneNum}`,
                                to: `whatsapp:+${data['user.phone']}`,
                                body: 
                                    `<div style="padding:10px;border-style: ridge">
                                    <p>Please verify your account</p>
                                    <h3>Click on the link below to verify your account</h3>
                                    <a href="${link}">Click here to verify</a>
                                    <p>Or You can copy the link and paste to your browser: ${link} </p>
                                    <p>Your login username:  <b>${req.body.phone}</b>  </p>
                                    <p>Your login password:  <b>${password}</b>  </p>
                                    <br/>
                                    <p>Note: Please verify first before login.</p>`
                            });
                            resolve({
                                status: 201,
                                id: user.id,
                                message: 'User was created. With whatapp invitaion.'
                            });
                        } catch (error) {
                            console.log("Whatsapp message sending error !");
                            console.log(error);
                        }
                        
                    }
                    if(!req.body.emailInvitation && !req.body.whatsappInvitation)
                    resolve({
                        status: 201,
                        message: 'User was created, Id:' + user.id + '. Without email/whatapp invitaion.'
                    });
                }).catch(function (err) {
                    reject({
                        status: 303,
                        message: err.message
                    });
                });
            }
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

service.passwordUpdate = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.user.findOne({
            where: {
                [Op.and]: [{
                    id: req.currentUser
                },{
                    password: req.body.oldPassword
                }]
            },
            raw: true
        })
        .then(async data => {
            if(!data){
                resolve({
                    status: 0,
                    message: 'Old password is not correct !'
                });
            }else{
                await db.user.update({password:req.body.newPassword}, {
                    where: {
                        id: req.currentUser
                    }
                })
                resolve({
                    status: 200,
                    message: 'Password updated Successfully !'
                });
            }
            
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            });
        });
    });
    
};

service.sendMail = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.otp.findOne({
            where: {
                userId: req.params.id
            },
            include: [{
                model: db.user,
                as: "user"
            }],
            raw: true
        })
        .then(async data => {
            if(!data){
                resolve({
                    status: 402,
                    message: 'Otp not found for this user'
                });
            }else{
                const link = req.protocol + '://' + req.get('host') + `/api/auth/verification/otp/${data['user.id']}&${data.otp}`;
                await emailService.sendMail({
                    To: [data['user.email']],
                    MailSubject: "Account Verification",
                    MailBody: `
                    <div style="padding:10px;border-style: ridge">
                    <p>Please verify your account</p>
                    <h3>Click on the link below to verify your account</h3>
                    <a href="${link}">Click here to verify</a>
                    <p>Or You can copy the link and paste to your browser: ${link} </p>
                    <p>Your login username:  <b>${data['user.phone']}</b>  </p>
                    <p>Your login password:  <b>${data['user.password']}</b>  </p>
                    <br/>
                    <p>Note: Please verify first before login.</p>
                    `
                },req);
                
                resolve({
                    status: 200,
                    message: 'Email Sended'
                });
            }
            
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            });
        });
    });
    
};

service.sendWhatsapp = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.otp.findOne({
            where: {
                userId: req.params.id
            },
            include: [{
                model: db.user,
                as: "user"
            }],
            raw: true
        })
        .then(async data => {
            if(!data){
                resolve({
                    status: 402,
                    message: 'Otp not found for this user'
                });
            }else{
                const link = req.protocol + '://' + req.get('host') + `/api/auth/verification/otp/${data['user.id']}&${data.otp}`;
                
                const client = require("twilio")(
                    appConfig.appSettings.TWILIO_ACCOUNT_SID,
                    appConfig.appSettings.TWILIO_AUTH_TOKEN
                );
                if(!data['user.phone'])
                resolve({
                    status: 0,
                    message: 'No Phone Number Found for that user.'
                });

                await client.messages.create({
                    from: `whatsapp:${appConfig.appSettings.Twilio_PhoneNum}`,
                    to: `whatsapp:+${data['user.phone']}`,
                    body: 
                        `<div style="padding:10px;border-style: ridge">
                        <p>Please verify your account</p>
                        <h3>Click on the link below to verify your account</h3>
                        <a href="${link}">Click here to verify</a>
                        <p>Or You can copy the link and paste to your browser: ${link} </p>
                        <p>Your login username:  <b>${data['user.phone']}</b>  </p>
                        <p>Your login password:  <b>${data['user.password']}</b>  </p>
                        <br/>
                        <p>Note: Please verify first before login.</p>`
                });

                resolve({
                    status: 200,
                    message: 'Whatsapp Invitation Sended'
                });
            }
            
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            });
        });
    });
    
};

service.update = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.user.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(async () => {
            if(req.body.permissions){
                await db.userPermission.destroy({
                    where: {
                        [Op.and]: [{
                            userId: req.params.id
                        }]
                    }
                }).then(async result => {
                    req.body.permissions.forEach(element => {
                        element.userId = req.params.id;
                    });
                    await db.userPermission.bulkCreate(req.body.permissions).then(()=>{
                        resolve({
                            status: 200,
                            message: 'User was updated.'
                        });
                    });
                });
            }else{
                resolve({
                    status: 200,
                    message: 'User was updated.'
                });
            }
            
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

service.delete = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.user.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            resolve({
                status: 200,
                message: 'User deleted successfully.'
            });
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            });
        });
    });
};

module.exports = service;