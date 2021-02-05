module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //ㅇㅣ모티콘
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Ask);
    db.Image.belongsTo(db.Answer);
  };
  return Image;
};
