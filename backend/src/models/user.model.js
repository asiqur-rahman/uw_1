const dbQuery = require('../db/database');
const tableName="user";
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(tableName, {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Firstname cannot be empty !!"}
      }
    },
    lastName: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Lastname cannot be empty !!"}
      }
    },
    gender: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    position: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    phone: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    idNumber: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    email: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    password: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    profilePicture: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    birthDate: {
      type: Sequelize.DATEONLY(),
      allowNull:true
    },
    address: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    seniority: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    experience: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    comments: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    activityPicture: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    fileName: {
      type: Sequelize.STRING(),
      allowNull:true
    },
    verified: {
      type: Sequelize.BOOLEAN(),
      allowNull:true,
      defaultValue: false
    } ,
    deleted: {
      type: Sequelize.BOOLEAN(),
      allowNull:true,
      defaultValue: false
    },
    confirmed: {
      type: Sequelize.BOOLEAN(),
      allowNull:true,
      defaultValue: false
    } 
  },{
  //   defaultScope: {
  //     attributes: {
  //        exclude: ['password','createdAt','updatedAt']
  //     }
  //   },
  //   scopes: {
  //     loginPurpose: {
  //       attributes: {
  //         exclude: ['createdAt','updatedAt']
  //       }
  //     },
  //     authPurpose: {
  //       attributes: {
  //         exclude: ['createdAt','updatedAt']
  //       }
  //     }
  // }
});
  
  return User;
};


// module.exports.findOne = async (params) => {
//         const { columnSet, values } = multipleColumnSet(params)

//         const sql = `SELECT * FROM ${tableName}
//         WHERE ${columnSet}`;

//         const result = await dbQuery.query(sql, [...values]);
//         // return back the first row (user)
//         return result[0];
//     }