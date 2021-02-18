const Sequelize = require("sequelize");

const answer = require("./answer");
const ask = require("./ask");
const hashtag = require("./hashtag");
const user = require("./user");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.Answer = answer;
db.Ask = ask;
db.User = user;
db.Hashtag = hashtag;

/* 반복문 돌면서 db에 models 등록 */
Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
