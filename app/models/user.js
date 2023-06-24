'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: 'roleId',
      })

      this.hasMany(models.Course, {
        foreignKey: 'instructorId'
      })
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    encryptedPassword: DataTypes.STRING,
    gender: DataTypes.STRING,
    photoProfile: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    phoneNumber: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    destroyedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    deletedAt: 'destroyedAt'
  });
  return User;
};