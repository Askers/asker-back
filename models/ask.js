module.exports = (sequelize, DataTypes) => {
  const Ask = sequelize.define(
    "Ask",
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
  Ask.associate = (db) => {
    db.Ask.belongsTo(db.User);
    db.Ask.belongsTo(db.Ask);
    db.Ask.hasMany(db.Image);
    db.Ask.belongsToMany(db.Hashtag, { through: "Hashtaged" });
    db.Ask.belongsToMany(db.User, { through: "Like", as: "Likers" });
  };
  return Ask;
};
