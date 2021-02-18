const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    // 상속받은 것에서 부모 호출 시 super
    return super.init(
      {
        // id 기본적으로 할당된다
        email: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        username: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "User",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associations(db) {
    db.User.hasMany(db.Ask);
    db.User.hasMany(db.Answer);
    db.User.belongsToMany(db.Ask, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreinKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  }
};
