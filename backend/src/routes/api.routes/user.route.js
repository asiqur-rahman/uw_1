const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const userController = require('../../controllers/api.controllers/user.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { userCreateValidator,userSendMailValidator,userPasswordUpdateValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/id/:id', awaitHandlerFactory(userController.getById));
router.patch('/id/:id',userCreateValidator, awaitHandlerFactory(userController.update));
router.delete('/id/:id', awaitHandlerFactory(userController.delete));
router.get('/list', awaitHandlerFactory(userController.list));
router.post('/', userCreateValidator, awaitHandlerFactory(userController.create));
router.post('/passwordUpdate', userPasswordUpdateValidator, awaitHandlerFactory(userController.passwordUpdate));
router.post('/sendmail/id/:id', awaitHandlerFactory(userController.sendMail));
router.post('/sendwhatsapp/id/:id', awaitHandlerFactory(userController.sendWhatsapp));
router.get('/roles', awaitHandlerFactory(userController.roleDropdown));

module.exports = router;