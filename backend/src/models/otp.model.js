module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define("otp", {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    otp: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "OTP cannot be empty !!"}
      }
    },
  },{
    defaultScope: {
      where:{
        
      },
      attributes: {
         exclude: ['createdAt','updatedAt']
      }
    },
    scopes: {
    
  }
});
  return table;
};
