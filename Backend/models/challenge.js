module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define('Challenge', {

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    participants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tags: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  }, {
    timestamps: true, 
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', 
  });

  return Challenge;
};