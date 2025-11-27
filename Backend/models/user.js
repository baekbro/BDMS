module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // 중복 이메일 방지
    },
    password: {
      type: DataTypes.STRING(200), // 암호화된 문자열이라 길게 잡음
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }
  }, {
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });

  return User;
};