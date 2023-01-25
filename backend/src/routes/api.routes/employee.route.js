const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const userController = require('../../controllers/api.controllers/user.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { employeeCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/id/:id', awaitHandlerFactory(userController.getById));
router.patch('/id/:id', awaitHandlerFactory(userController.update));
router.delete('/id/:id', awaitHandlerFactory(userController.delete));
router.get('/list', awaitHandlerFactory(userController.employeeList));
router.post('/', employeeCreateValidator, awaitHandlerFactory(userController.employeeCreate));
router.delete('/id/:id', awaitHandlerFactory(userController.employeeDelete));

module.exports = router;