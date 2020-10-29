// =============================== INIT DB ==============================
// =============================== INIT DB ==============================
// =============================== INIT DB ==============================

const { Sequelize } = require('sequelize');

module.exports = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  query: { raw: true },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

});
