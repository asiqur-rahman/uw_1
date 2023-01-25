const express = require('express');
const router = express.Router();
const fileController = require('../../controllers/api.controllers/file.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.post('/:clientId&:loanType', awaitHandlerFactory(fileController.upload));  
router.get(['/:clientId&:loanType','/:clientId'], awaitHandlerFactory(fileController.getFiles));    
router.delete(['/dir/:clientId&:loanType'], awaitHandlerFactory(fileController.deleteDir));  
router.delete(['/ind/:clientId&:loanType&:fileName'], awaitHandlerFactory(fileController.deleteFiles));

module.exports = router;