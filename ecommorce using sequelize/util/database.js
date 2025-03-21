const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'ChangeMe007', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
