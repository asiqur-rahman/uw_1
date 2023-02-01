const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const userService = require('../../service/user.service');
const otpGenerator = require('otp-generator');

module.exports.getById = async(req, res, next) => {
    await userService.getById(req.params.id,req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.getByCidScid = async(req, res, next) => {
    await userService.getByCidScid(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    req.body.roleId=3;
    req.body.otp=OTP;
    await userService.create(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.passwordUpdate = async(req, res, next) => {
    await userService.passwordUpdate(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.sendMail = async(req, res, next) => {
    await userService.sendMail(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.sendWhatsapp = async(req, res, next) => {
    await userService.sendWhatsapp(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.employeeCreate = async(req, res, next) => {
    console.log(req.body)
    const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    req.body.roleId=2;
    req.body.otp=OTP;
    await userService.create(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.update = async(req, res, next) => {
    await userService.update(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.delete = async(req, res, next) => {
    await userService.delete(req)
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.passwordReset = async (req, res, next) => {
    await userService.resetPassword(req).then(data => {
        return res.send(data);
    });
  }

module.exports.roleDropdown = async(req, res, next) => {
    await userService.getRoleDD()
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    });
};

module.exports.changeStatus = async (req, res, next) => {
    await userService.changeStatus(req).then(data => {
      res.status(200).send(data);
    });
}

module.exports.list = async(req, res, next) => {
    await userService.indexData(req,3)
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.employeeList = async(req, res, next) => {
    await userService.indexData(req,2)
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}