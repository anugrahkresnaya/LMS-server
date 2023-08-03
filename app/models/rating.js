'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userData'
      })
    }
  }
  Rating.init({
    userData: DataTypes.JSONB,
    value: DataTypes.INTEGER,
    review: DataTypes.TEXT,
    courseSlug: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};