const { Sequelize } = require('sequelize');

const db = require('../config/db');

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  profile_img: {
    type: Sequelize.STRING,
  },

});

module.exports = User;
