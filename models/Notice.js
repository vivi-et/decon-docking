const { Sequelize } = require('sequelize');
const db = require('../config/db');

const Notice = db.define('notice', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
  },
  text: {
    type: Sequelize.STRING,
  },
  option: {
    type: Sequelize.JSON,
  },

});

// Notice.belongsTo(User);

module.exports = Notice;
