const Sequelize = require('sequelize');
const db = require('./db');

// Entidade Product
const Product = db.define('Product', {
    productID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
},{
    timestamps: false
});

// Entidade Loja
const Loja = db.define('Loja', {
    cnpjLoja: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ramo: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: false
});

// Entidade Cliente
const Cliente = db.define('Cliente', {
    clienteID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nome:{
        type: Sequelize.STRING
    }
},
{
    timestamps: false
});

// Entidade Oferece
const Oferece = db.define('Oferece', {
    quantidadeEstoque: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
},
{
    timestamps: false
});

// Entidade Vende
const Vende = db.define('Vende', {
    quantidadeVendida: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false
    }
},
{
    timestamps: false
});

// Mapeando relacionamento Oferece
Loja.belongsToMany(Product, { through: Oferece, foreignKey: 'cnpjLoja', onDelete: 'CASCADE' });
Product.belongsToMany(Loja, { through: Oferece, foreignKey: 'productID', onDelete: 'CASCADE' });

// Mapeando relacionamento Vende
Loja.belongsToMany(Product, { through: Vende, foreignKey: 'cnpjLoja', onDelete: 'CASCADE' });
Product.belongsToMany(Loja, { through: Vende, foreignKey: 'productID', onDelete: 'CASCADE' });
Cliente.belongsToMany(Loja, { through: Vende, foreignKey: 'clienteID', onDelete: 'CASCADE' });

// Sincroniza o modelo com o banco de dados (cria a tabela)
Product.sync();
Loja.sync();
Cliente.sync();
Vende.sync();
Oferece.sync();

// Exportando as entidades
exports.productCreate = Product;
exports.lojaCreate = Loja;
exports.clienteCreate = Cliente;
exports.vendeCreate = Vende;
exports.ofereceCreate = Oferece;
