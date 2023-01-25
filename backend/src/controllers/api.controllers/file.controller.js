const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');
const path = require('path');

module.exports.upload = async (req, res, next) => {
    console.log("upload files");
    var userId=req.params.clientId;
    var loanType=req.params.loanType;
    if(userId && loanType){
        var mainPath=path.join(__dirname, '..','..','..', 'upload');
        if(!fs.existsSync(mainPath)){
            await fs.mkdirSync(mainPath);
        }

        var uploadPath=path.join(mainPath,'fileStorage');
        if(!fs.existsSync(uploadPath)){
            await fs.mkdirSync(uploadPath);
        }

        var loanTypePath=path.join(uploadPath,'clientId-'+userId)
        if(!fs.existsSync(loanTypePath)){
            await fs.mkdirSync(loanTypePath);
        }

        var finalDestination=path.join(loanTypePath,'fileType-'+loanType)
        if(!fs.existsSync(finalDestination)){
            await fs.mkdirSync(finalDestination);
        }

        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
            cb(null, finalDestination)
        },
        filename: function (req, file, cb) {
            // cb(null, Date.now() + '-' +file.originalname )
            cb(null, file.originalname )
        }
        });
        
        var upload = multer({ storage: storage }).array('file');

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            return res.status(200).json({
                statusCode:200,
                message:"File Uploaded Successfully"
            });
        });
    }
};


module.exports.getFiles = async (req, res, next) => {
    var userId=req.params.clientId;
    var loanType=req.params.loanType;
    var results=[];
    if(userId && loanType){
        const foldersPath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId,'fileType-'+loanType);
        if(!fs.existsSync(foldersPath)){
            return res.status(200).json({
                statusCode:303,
                message:"No File Found"
            });
        }
        var files = fs.readdirSync(foldersPath);
        var count=1;
        var data=[];
        files.forEach(element => {
            const downloadPath=path.join(req.protocol + '://' + req.get('host'),'fileFor','fileStorage','clientId-'+userId,'fileType-'+loanType,element).toString()
            data.push({id:count++,name:element,link:downloadPath})
        });
        results.push(data);
        res.json({results});
    }
    else if(userId){
        const foldersPath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId);
        if(!fs.existsSync(foldersPath)){
            return res.status(200).json({
                statusCode:303,
                message:"No File Found"
            });
        }
        //reading directory in synchronous way
        var folders = fs.readdirSync(foldersPath);
        var results=[];
        folders.forEach(element => {
            const filePath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId,element);
            var files = fs.readdirSync(filePath);
            var count=1;
            var data=[];
            files.forEach(file => {
                const downloadPath=path.join(req.protocol + '://' + req.get('host'),'fileFor','fileStorage','clientId-'+userId,element,file).toString()
                data.push({id:count++,name:file,link:downloadPath,folder:element.split('-')[1]})
            });
            results.push(data);
        });
        res.json({results});
    }
};

module.exports.deleteFiles = async (req, res, next) => {
    var userId=req.params.clientId;
    var loanType=req.params.loanType;
    var fileName=req.params.fileName;
    const foldersPath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId,'fileType-'+loanType,fileName);
    if(!fs.existsSync(foldersPath)){
        return res.status(200).json({
            statusCode:303,
            message:"No File Found"
        });
    }else{
        fs.unlinkSync(foldersPath);
        return res.status(200).json({
            statusCode:200,
            message:"File Removed Successfully"
        });
    }
};

module.exports.deleteDir = async (req, res, next) => {
    var userId=req.params.clientId;
    var loanType=req.params.loanType;
    const foldersPath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId,'fileType-'+loanType);
    if(!fs.existsSync(foldersPath)){
        return res.status(200).json({
            statusCode:303,
            message:"No Dir Found"
        });
    }else{
        fs.rmSync(foldersPath, { recursive: true, force: true });
        return res.status(200).json({
            statusCode:200,
            message:"Dir Removed Successfully"
        });
    }
};


module.exports.getFilesWithLink = (userId,loanType,req) => {
    var results=[];
    if(userId && loanType){
        const foldersPath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId,'fileType-'+loanType);
        if(!fs.existsSync(foldersPath)){
            return false;
        }
        var files = fs.readdirSync(foldersPath);
        var count=1;
        var data=[];
        files.forEach(element => {
            const downloadPath=path.join(req.protocol + '://' + req.get('host'),'fileFor','fileStorage','clientId-'+userId,'fileType-'+loanType,element).toString()
            data.push({id:count++,name:element,link:downloadPath})
        });
        results.push(data);
        return results;
    }
    else if(userId){
        const foldersPath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId);
        if(!fs.existsSync(foldersPath)){
            return false
        }
        //reading directory in synchronous way
        var folders = fs.readdirSync(foldersPath);
        var results=[];
        folders.forEach(element => {
            const filePath=path.join(__dirname, '..','..','..', 'upload','fileStorage','clientId-'+userId,element);
            var files = fs.readdirSync(filePath);
            var count=1;
            var data=[];
            files.forEach(file => {
                const downloadPath=path.join(req.protocol + '://' + req.get('host'),'fileFor','fileStorage','clientId-'+userId,element,file).toString()
                data.push({id:count++,name:file,link:downloadPath,folder:element.split('-')[1]})
            });
            results.push(data);
        });
        return results;
    }
};

// hash password if it exists
hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}