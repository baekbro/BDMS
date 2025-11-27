const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', 
    logging: false,   
    timezone: '+09:00', 
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 연결
db.Challenge = require('./challenge')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

module.exports = db;