const { Sequelize } = require('sequelize');
const db = require('../config/db');

const Test = db.define('test', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: Sequelize.JSON,
  },

});

// Test.belongsTo(User);

module.exports = Test;
