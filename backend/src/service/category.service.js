const db = require('../models/model');
var path = require('path');
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');
const emailService = require('../externalService/email.service');

const service = {};

service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.category.findOne({
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


service.indexData = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.category.findAndCountAll({
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

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.category.create(req.body).then(async data => {
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

service.update = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.category.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(async () => {
            resolve({
                status: 200,
                message: 'Category was updated.'
            });
        }).catch(function (err) {
            reject({
                status: 0,
                message: 'Category was not updated.'
            });
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
        await db.category.destroy({
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