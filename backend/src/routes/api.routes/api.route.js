const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const employeeRouter = require('./employee.route');
const categoryRouter = require('./category.route');
const subCategoryRouter = require('./subCategory.route');
const fileRouter = require('./file.route');

router.use('/auth', authRouter);
router.use('/user', apiAuth(), userRouter);
router.use('/employee', apiAuth(), employeeRouter);
router.use('/category', apiAuth(), categoryRouter);
router.use('/subcategory', apiAuth(), subCategoryRouter);
router.use('/file', apiAuth(), fileRouter);

// 404 error
router.all('*', (req, res, next) => {
    res.json({
      statusCode:404,
      message:"Endpoint Not Found !",
      url:req.protocol + '://' + req.get('host') + req.originalUrl
  });
});

module.exports = router;