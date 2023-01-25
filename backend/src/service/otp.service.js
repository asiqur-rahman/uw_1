const db = require('../models/model')
var path = require('path')
const sequelize = require('sequelize')
const Op = require('sequelize').Op
const service = {};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.otp.create(req.body).then(async data => {
            resolve({
                status: 201,
                message: 'Data was created, Id:' + data.id
            });
        }).catch(function (err) {
            reject({
                status: 303,
                message: err.message
            });
        });
    })
};


service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.otp.findOne({
            where: {
                id: id
            },
            raw: true
        }).then(data => {
            if (data) {
                resolve({status:200,data:data});
            } else {
                resolve({
                    status: 404,
                    message: "Data not found !"
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

service.getBankAccountDD =async ()=> {
    return new Promise(async (resolve, reject) => {
        return await db.otp.findAll({
            where: {
                [Op.and]: [{
                    isActive: {
                        [Op.eq]: true
                    }
                }]
            },
            raw: true
        })
        .then(data => {
            let dd =[];
            data.map(item=>{
                dd.push({label:`${item.accountNumber} (${item.accountTitle})`,value:item.id});
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


service.indexData = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.otp.findAndCountAll({
            where: {
                isActive: true
            },
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo.rows) {
                var count = 0;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                })
                resolve({status:200,recordsTotal:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
        });
    });
};

service.update = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.otp.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(async (result) => {
                if (result) {
                    // await accountBalanceService.updateByCoaId(req).then(() => {
                        resolve({
                            status: 201,
                            message: 'Data was updated !'
                        });
                    // })
                } else {
                    reject({
                        status: 200,
                        message: 'Data not created'
                    });
                }
            });
        });
};

service.delete = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.otp.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            resolve({
                status: 200,
                message: 'Data deleted successfully.'
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