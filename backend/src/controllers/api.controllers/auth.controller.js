const db = require('../../models/model');
const enumm = require('../../utils/enum.utils');
const appConfig = require('../../../config/config.json');
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../service/user.service');
const fileService = require('./file.controller');

module.exports.login = async (req, res, next) => {
  var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  const {
    username,
    password
  } = req.body;
    userService.getByName(username).then(async (user) => {
    if (user.status===404) {
      return res.send({status:0,message:"Unable to login !"});
    }
    else {
      // const isMatch = await bcrypt.compare(password, user.data.password);
      if (password != user.data.password) {
        return res.send({status:0,message:'Incorrect password !'});
      } 
      else if(user.data.roleId!=1 && user.data.verified!=true){
        return res.send({status:0,message:'User not verified !'});
      }else {
        // user matched!
        const secretKey = appConfig.appSettings.SECRET_JWT;
        await db.userPermission.findAll({
          where: {
            userId: user.data.id
          },
          include: [{
            model: db.permission,
            as: "permission",
        }],
          raw: true
        }).then(result => {
          var data=[]
          result.map(function(item){data.push({permissionId:item.permissionId,permissionName:item['permission.name']})})

          const fullName=`${user.data['firstName']} ${user.data['lastName']}`;
          const detailsForToken = {
            full_name: fullName,
            user_id: user.data.id.toString(),
            role_id: user.data['role.id'].toString(),
            role_name: user.data['role.name'].toString(),
            clientIp: clientIp.toString()
          };
          var image = fileService.getFilesWithLink(user.data.id,"profilePicture",req);
          const token = jwt.sign(detailsForToken,secretKey, {
            expiresIn: appConfig.appSettings.SessionTimeOut
          });
          res.send({
            status:200,
            token,
            user_id:user.data.id,
            user_role:user.data['role.name'],
            permission:data,
            user_confirmed:user.data.confirmed??true,
            picture:image?image:null,
            sessionTime: appConfig.appSettings.SessionTimeOut
          });
        })
      }
    }
  })
};


module.exports.whoAmI = async (req, res, next) => {
  await db.user.findOne({
    where: {
      id: req.currentUser
    },
    include: [{
      model: db.role,
      as: "role"
    }],
    raw: true
  }).then(async user => {
    await db.userPermission.findAll({
      where: {
        userId: req.currentUser
      },
      include: [{
        model: db.permission,
        as: "permission"
      }],
      raw: true
    }).then(permissions => {
      user.permissions=permissions;
      user.files = fileService.getFilesWithLink(user.id,false,req);
      return res.status(200).send(user);
    }).catch(e => {
      return res.status(204).send();
    });
  }).catch(e => {
    return res.status(204).send();
  })
}


module.exports.updatePass = async (req, res, next) => {
  await db.user.update({password:req.body.newPassword,confirmed:true}, {
    where: {
        id: req.currentUser
    }
  }).then(async user => {
    return res.status(200).send({status:200});
  }).catch(e => {
    return res.status(204).send({status:204});
  })
}


module.exports.myPermissions = async (req, res, next) => {
  await db.userPermission.findAll({
    where: {
      userId: req.currentUser
    },
    include: [{
      model: db.permission,
      as: "permission"
    }],
    raw: true
  }).then(user => {
    return res.status(200).send(user);
  }).catch(e => {
    return res.status(204).send();
  })
}


module.exports.permissions = async (req, res, next) => {
  await db.permission.findAll({
    raw: true
  }).then(user => {
    return res.status(200).send(user);
  }).catch(e => {
    return res.status(204).send();
  })
}

module.exports.roles = async (req, res, next) => {
  await db.role.findAll({
    raw: true
  }).then(user => {
    return res.status(200).send(user);
  }).catch(e => {
    return res.status(204).send();
  })
}

module.exports.verification = async (req, res, next) => {
  await db.otp.findOne({
    where: {
      [Op.and]: [{
          otp: {
              [Op.eq]: req.params.otp
          }
      },
      {
        userId: {
            [Op.eq]: req.params.id
        }
    }]
    },
    include: [{
      model: db.user,
      as: "user"
    }],
    raw: true
  }).then(async user => {
    if(user){
      await db.user.update({verified:true}, {
        where: {
            id: user['user.id']
        }
    }).then(async (data) => {
      console.log("Redirect to : ",appConfig.appSettings.FontendUrl+`?result=200&phone=${user['user.phone']}`)
      res.writeHead(302, {
        'Location': appConfig.appSettings.FontendUrl+`?result=200&phone=${user['user.phone']}`
      });
      return res.end();
    })
    }
    else{
      res.writeHead(302, {
        'Location': appConfig.appSettings.FontendUrl+'?result=100'
      });
      return res.end();
    }
  }).catch(e => {
    return res.status(204).send();
  })
}


// hash password if it exists
hashPassword = async (req) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
  }
}