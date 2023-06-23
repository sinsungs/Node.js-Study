const Sequelize = require('sequelize');

class Reviews extends Sequelize.Model {
  static initiate(sequelize) {
    Reviews.init({
      isbn: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      comment: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Reviews',
      tableName: 'reviews',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  
  static associate(db) {
    // db.Post.belongsTo(db.User);
    // db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});
  }
}

module.exports = Reviews;
