const joi = require('@hapi/joi');

let permisisonObject = joi.object().keys({
    permissionId: joi.number().required(),
});

const schema = {
    userCreate:joi.object({
        firstName:joi.string().required(),
        lastName:joi.string().required(),
        gender:joi.string().allow(''),
        birthDate:joi.string().allow(''),
        idNumber:joi.string().allow(''),
        address:joi.string().allow(''),
        phone:joi.string().required(),
        password:joi.string().allow(''),
        seniority:joi.string().allow(''),
        categoryId:joi.number(),
        subCategoryId:joi.number(),
        email:joi.string().email({ tlds: { allow: true }}).required(),
        experience:joi.string().allow(''),
        comments:joi.string().allow(''),
        profilePicture:joi.string().allow(''),
        activityPicture:joi.string().allow(''),
        permissions:joi.array().items(permisisonObject),
        whatsappInvitation:joi.boolean().required(),
        emailInvitation:joi.boolean().required(),
    }),

    employeeCreate:joi.object({
        firstName:joi.string().required(),
        lastName:joi.string().required(),
        gender:joi.string().allow(''),
        birthDate:joi.string().allow(''),
        idNumber:joi.string().allow(''),
        address:joi.string().allow(''),
        phone:joi.string().required(),
        password:joi.string().allow(''),
        position:joi.string().allow(''),
        categoryId:joi.number(),
        subCategoryId:joi.number(),
        email:joi.string().email({ tlds: { allow: true }}).required(),
        experience:joi.string().allow(''),
        permissions:joi.array().items(permisisonObject),
        comments:joi.string().allow(''),
        // profilePicture:joi.string().required(),
        // activityPicture:joi.string().allow(''),
        whatsappInvitation:joi.boolean().required(),
        emailInvitation:joi.boolean().required(),
    }),

    userSendMail:joi.object({
        link:joi.string().required()
    }),

    loginValidator:joi.object({
        username:joi.string().required(),
        password:joi.string().required()
    }),

    categoryValidator:joi.object({
        name:joi.string().required()
    }),

    subCategoryValidator:joi.object({
        name:joi.string().required(),
        categoryId:joi.number().required(),
    }),

    userPasswordUpdate:joi.object({
        oldPassword:joi.string().required(),
        newPassword:joi.string().required(),
    }),
}

module.exports.userCreateValidator = async (req,res,next)=>{
    const value= await schema.userCreate.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.userPasswordUpdateValidator = async (req,res,next)=>{
    const value= await schema.userPasswordUpdate.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.userSendMailValidator = async (req,res,next)=>{
    const value= await schema.userSendMail.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.employeeCreateValidator = async (req,res,next)=>{
    const value= await schema.employeeCreate.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.loginValidator = async (req,res,next)=>{
    const value=await schema.loginValidator.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.categoryValidator = async (req,res,next)=>{
    const value=await schema.categoryValidator.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};

module.exports.subCategoryValidator = async (req,res,next)=>{
    const value=await schema.subCategoryValidator.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};