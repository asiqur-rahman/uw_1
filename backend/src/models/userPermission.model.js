module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define("userPermission", {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    }
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
