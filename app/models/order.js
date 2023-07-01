'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Course, {
        foreignKey: 'courseId'
      })

      this.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      this.belongsTo(models.User, {
        foreignKey: 'instructorId'
      })

      this.belongsTo(models.Course, {
        foreignKey: 'amount'
      })
    }
  }
  Order.init({
    courseId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    instructorId: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    transactionId: DataTypes.STRING,
    status: DataTypes.STRING,
    token: DataTypes.STRING,
    redirectUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};