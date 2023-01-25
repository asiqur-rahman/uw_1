module.exports = (sequelize, Sequelize) => {
  const table = sequelize.define("subCategory", {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Role cannot be empty !!"}
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
