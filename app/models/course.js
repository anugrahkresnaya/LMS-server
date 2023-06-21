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
    published: DataTypes.BOOLEAN,
    instructor: DataTypes.INTEGER,
    paid: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};