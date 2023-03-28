'use strict'
const { Model } = require('sequelize')
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
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      encryptedPassword: DataTypes.STRING,
      gender: DataTypes.STRING,
      photoProfile: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
    }
  )
  return User
}
