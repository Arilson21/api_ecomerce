const {Sequelize, DataTypes} = require('sequelize')
const database = require("../config/dbConnect");
const User = require("./userModel")


/*  const Category = database.define('category', {
    // ... outras propriedades da categoria
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
}); */

const Rating = database.define('rating', {
    star: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    }
})



const Product = database.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    title: {
      type: Sequelize.STRING,
      unique:true,
      allowNull: false,
      set(value) {
        // Remove espaços em branco do início e do final da string antes de salvar
        this.setDataValue('title', value.trim());
      },
    },

    slug: {
        type: Sequelize.STRING,
        allowNull: false,
        
        set(value) {
            // Remove espaços em branco do início e do final da string antes de salvar
            this.setDataValue('slug', value.trim().toLowerCase());
        },
      },

    description: {
        type: Sequelize.STRING,
        allowNull: false
    },

    price: {
        type:  DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull:{
                msg: `Preencha o campo`
            }
        }

    },

    category: {
        type: Sequelize.STRING,
        allowNull: false
    },

    brand: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    sold: {
       type: DataTypes.NUMBER,
       defaultValue: 0,
       
    },

    images: {
        type: DataTypes.JSON,
        defaultValue: [],
    },

    color: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    




}, {timestamps: true,

});


/* // Estabelecendo a relação entre Product e Category
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
// ou
// Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' }); */


// Relacionamento entre Rating e User
Rating.belongsTo(User, { foreignKey: 'postedById', as: 'postedBy' });

// Sincronizando os modelos com o banco de dados
/* Sequelize.sync({ force: true }).then(() => {
  console.log('Modelos sincronizados com o banco de dados.');
}) */


module.exports = Product;


