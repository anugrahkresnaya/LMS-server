'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'instructorId'
      })

      this.hasMany(models.Order, {
        foreignKey: 'courseData'
      })
    }
  }
  Course.init({
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    video: DataTypes.STRING,
    pdf: DataTypes.STRING,
    instructorId: DataTypes.INTEGER,
    paid: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};