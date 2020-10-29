const { Sequelize } = require('sequelize');
const db = require('../config/db');

const Design = db.define('design', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  category1: {
    // 상품대표이미지
    type: Sequelize.STRING,
  },
  category2: {
    // 상품대표이미지
    type: Sequelize.STRING,
  },
  category3: {
    // 상품대표이미지
    type: Sequelize.STRING,
  },

  design_name: {
    // 상품대표이미지
    type: Sequelize.STRING,
  },
  price1: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },
  quantity: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },

  timeperitem: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },

  fee: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },

  fixfreechance: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },
  fixprice: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },
  baseprice: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },
  skills: {
    // 상품대표이미지
    type: Sequelize.JSON,
  },

  colorformat: {
    // 상품대표이미지
    type: Sequelize.STRING,
  },

  width: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },
  height: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },
  format: {
    // 상품대표이미지
    type: Sequelize.STRING,
  },

  dpi: {
    // 상품대표이미지
    type: Sequelize.INTEGER,
  },

  keyword: {
    // 상품대표이미지
    type: Sequelize.STRING,
  },

  maindescription: {
    // 상품대표이미지
    type: Sequelize.TEXT,
  },

  options: {
    // 카테고리 1>2>3 , 디자인>로고>문양로고
    type: Sequelize.JSON,
  },
  image_main: {
    type: Sequelize.STRING,
  },
  image_sub: {
    // 카테고리 1>2>3 , 디자인>로고>문양로고
    type: Sequelize.JSON,
  },
});

module.exports = Design;
