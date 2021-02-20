const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    // 상속받은 것에서 부모 호출 시 super
    return super.init(
      {
        name: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
      },
      {
        modelName: "Hashtag",
        charset: "utf8",
        collate: "utf8_general_ci",
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Ask, { through: "Hashtaged" });
  }
};
