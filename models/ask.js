const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Ask extends Model {
  static init(sequelize) {
    // 상속받은 것에서 부모 호출 시 super
    return super.init(
      {
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        content: {
          type: DataTypes.STRING(1500),
          allowNull: false,
        },
        isAnswered: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        modelName: "Ask",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //ㅇㅣ모티콘
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Ask.belongsTo(db.User, {
      foreignKey: "target_user_id",
      targetKey: "id",
    });
    db.Ask.belongsToMany(db.Hashtag, { through: "Hashtaged" });
    db.Ask.belongsToMany(db.User, { through: "Like", as: "Likers" });
  }
};
