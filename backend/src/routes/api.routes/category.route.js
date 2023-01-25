const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const bankAccountController = require('../../controllers/api.controllers/category.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { categoryValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/id/:id',  awaitHandlerFactory(bankAccountController.getById));
router.post('/', categoryValidator, awaitHandlerFactory(bankAccountController.create));
router.patch('/id/:id',categoryValidator,  awaitHandlerFactory(bankAccountController.update));
router.delete('/id/:id',  awaitHandlerFactory(bankAccountController.delete));
router.get('/list', awaitHandlerFactory(bankAccountController.list));
router.get('/dropdown', awaitHandlerFactory(bankAccountController.dropdown));


module.exports = router;