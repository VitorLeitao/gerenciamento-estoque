const Sequelize = require('sequelize');
const db = require('./db');

const Product = db.define('Product', {
    productID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    quantidadeEstoque: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// Sincroniza o modelo com o banco de dados (cria a tabela)
Product.sync();

exports.productCreate = Product;