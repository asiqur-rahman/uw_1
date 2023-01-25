const config = require("../../config/config.json");
const enumm = require('../utils/enum.utils');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.databaseSettings.database,
    config.databaseSettings.username,
    config.databaseSettings.password, 
    {
        host: config.databaseSettings.host,
        dialect: config.databaseSettings.dialect,
        operatorsAliases: 0,
        logging: config.databaseSettings.logging,
        pool: {
            max: config.databaseSettings.pool.max,
            min: config.databaseSettings.pool.min,
            acquire: config.databaseSettings.pool.acquire,
            idle: config.databaseSettings.pool.idle
        }
    }
);
sequelize.authenticate()
    .then(() => {
      // var parentId=1;
      // var lastParent={name:"Expense"};
      // var finalJsonData=[];
      // expenses.forEach(async element => {
      //   let name=`${lastParent.name}:${element.name}`;
      //   finalJsonData.push({
      //     "name" : name,
      //     "code" : "301",
      //     "baseCode" : null,
      //     "level" : name.split(":").length-1,
      //     "isActive" : 1,
      //     "createdAt" : "2022-10-27 11:24:23",
      //     "updatedAt" : "2022-10-27 11:24:23",
      //     "userId" : 1,
      //     "currencyId" : 1,
      //     "parentId" : null
      //   })
      //   if(element.header)lastParent={name:`Expense:${element.name}`}
      // });
      console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.permission = require("./permission.model")(sequelize, Sequelize);
db.userPermission = require("./userPermission.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.otp = require("./otp.model")(sequelize, Sequelize);
db.category = require("./category.model")(sequelize, Sequelize);
db.subCategory = require("./subCategory.model")(sequelize, Sequelize);

//Associations

db.user.belongsTo(db.role,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.role.hasMany(db.user);

db.user.belongsTo(db.category,{ foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
db.category.hasMany(db.user);

db.user.belongsTo(db.subCategory,{ foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
db.subCategory.hasMany(db.user);

db.userPermission.belongsTo(db.permission,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.permission.hasMany(db.userPermission);

db.userPermission.belongsTo(db.user,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.user.hasMany(db.userPermission);

db.otp.belongsTo(db.user,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.user.hasMany(db.otp);

db.subCategory.belongsTo(db.category,{ foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
db.category.hasMany(db.subCategory);

// db.sequelize.sync();

// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then ( function () {
//   db.sequelize.sync ({ force: true }).then ( function () {
//     console.log('Drop and Resync Database with { force: true }');
//     initial();
//   });
// });


async function initial() {

    await db.role.create({
      name: "root",
    });

    await db.role.create({
      name: "employee",
    });

    await db.role.create({
      name: "user",
    });

    await db.category.create({
      name: "خدمات فنية",
    });

    await db.category.bulkCreate([
      {
        name: "خدمات تعليمية ",
      },
      {
        name: "خدمات إستشارية",
      },
      {
        name: "خدمات صحية",
      }
    ]);

    await db.subCategory.bulkCreate([
    {
      name: "فني كهرباء",
      categoryId:1
    },
    {
      name: "فني ديكور منزلي",
      categoryId:1
    },
    {
      name: "فني سباكة",
      categoryId:1
    },
    {
      name: "فني بناء",
      categoryId:1
    },
    {
      name: "فني سيراميك",
      categoryId:1
    },
    {
      name: " فني دهان",
      categoryId:1
    }
  ]);

    await db.permission.bulkCreate([
    {
      name: "getusers",
    },
    {
      name: "getemployes",
    },
    {
      name: "deleteuser",
    },
    {
      name: "deleteemploye",
    },
    {
      name: "updateuser",
    },
    {
      name: "updateemploye",
    },
    {
      name: "adduser",
    },
    {
      name: "addemploye",
    },
    {
      name: "addpermission",
    },
    {
      name: "user_details",
    },
    {
      name: "employee_details",
    }
  ]);

    await db.user.create({
      firstName: "asiqur",
      lastName: "rahman",
      phone: "123456",
      password: "admin",
      email:"root@gmail.com",
      roleId:1
    });

    await db.userPermission.bulkCreate([
      {
        permissionId: 1,
        userId:1
      },
      {
        permissionId: 2,
        userId:1
      },
      {
        permissionId: 3,
        userId:1
      },
      {
        permissionId: 4,
        userId:1
      },
      {
        permissionId: 5,
        userId:1
      },
      {
        permissionId: 6,
        userId:1
      },
      {
        permissionId: 7,
        userId:1
      },
      {
        permissionId: 8,
        userId:1
      },
      {
        permissionId: 9,
        userId:1
      },
      {
        permissionId: 10,
        userId:1
      },
      {
        permissionId: 11,
        userId:1
      }
      
    ]);
  
  }

module.exports = db;