const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Answer extends Model {
  static init(sequelize) {
    // 상속받은 것에서 부모 호출 시 super
    return super.init(
      {
        content: {
          type: DataTypes.STRING(1500),
          allowNull: false,
        },
      },
      {
        modelName: "Answer",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //ㅇㅣ모티콘
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Answer.belongsTo(db.User, {
      foreignKey: "target_user_id",
      targetKey: "id",
    });
    db.Answer.belongsTo(db.Ask, {
      foreignKey: "linked_ask_id",
      targetKey: "id",
    });
  }
};
