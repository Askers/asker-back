const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    // 상속받은 것에서 부모 호출 시 super
    return super.init(
      {
        socialKey: {
          type: DataTypes.STRING(50),
          unique: true,
        },
        email: {
          type: DataTypes.STRING(50),
        },
        username: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
        },
        provider: {
          type: DataTypes.STRING(10),
        },
      },
      {
        modelName: "User",
        charset: "utf8",
        collate: "utf8_general_ci",
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Ask, { foreignKey: "target_user_id", sourceKey: "id" });
    db.User.hasMany(db.Answer, {
      foreignKey: "target_user_id",
      sourceKey: "id",
    });
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
