const { Sequelize } = require('sequelize');

const db = require('../config/db');

const Article = db.define('article', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    unique: true,
  },
  text: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.JSON,
  },
});

module.exports = Article;
