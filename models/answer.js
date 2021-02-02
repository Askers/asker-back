module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "Answer",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", //ㅇㅣ모티콘
    }
  );
  Answer.associate = (db) => {
    db.Answer.belongsTo(db.User);
    db.Answer.belongsTo(db.Ask);
    db.Answer.hasMany(db.Image);
  };
  return Answer;
};
