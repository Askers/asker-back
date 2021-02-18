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
        isAnswered: {
          type: DataTypes.BOOLEAN(false),
        },
      },
      {
        modelName: "Answer",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //ㅇㅣ모티콘
        sequelize,
      }
    );
  }

  static associations(db) {
    db.Answer.belongsTo(db.User);
    db.Answer.belongsTo(db.Ask);
    db.Answer.hasMany(db.Image);
  }
};
