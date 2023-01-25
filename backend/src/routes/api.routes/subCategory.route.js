const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const bankAccountController = require('../../controllers/api.controllers/subCategory.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { subCategoryValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/id/:id',  awaitHandlerFactory(bankAccountController.getById));
router.get('/bycategory/id/:id',  awaitHandlerFactory(bankAccountController.getByCategoryId));
router.post('/', subCategoryValidator, awaitHandlerFactory(bankAccountController.create));
router.patch('/id/:id',subCategoryValidator,  awaitHandlerFactory(bankAccountController.update));
router.delete('/id/:id',  awaitHandlerFactory(bankAccountController.delete));
router.get('/list', awaitHandlerFactory(bankAccountController.list));
router.get('/dropdown', awaitHandlerFactory(bankAccountController.dropdown));


module.exports = router;