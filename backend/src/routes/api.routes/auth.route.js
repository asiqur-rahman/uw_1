const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const authController = require('../../controllers/api.controllers/auth.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { loginValidator,userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.post('/login', loginValidator, awaitHandlerFactory(authController.login));
router.get('/whoami',apiAuth(), awaitHandlerFactory(authController.whoAmI));
router.post('/updatePass',apiAuth(), awaitHandlerFactory(authController.updatePass));
router.get('/mypermissions',apiAuth(), awaitHandlerFactory(authController.myPermissions));
router.get('/permissions/list',apiAuth(), awaitHandlerFactory(authController.permissions));
router.get('/roles/list',apiAuth(), awaitHandlerFactory(authController.roles));
router.get('/verification/otp/:id&:otp', awaitHandlerFactory(authController.verification));

module.exports = router;