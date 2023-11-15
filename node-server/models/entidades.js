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
    descricao: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING
    }
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
/*
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
*/

// Entidade Oferece
const Oferece = db.define('Oferece', {
    quantidadeEstoque: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    precoProduto: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    timestamps: false
});

/* 
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
*/

// Mapeando relacionamento Oferece
Loja.belongsToMany(Product, { through: Oferece, foreignKey: 'cnpjLoja', onDelete: 'CASCADE' });
Product.belongsToMany(Loja, { through: Oferece, foreignKey: 'productID', onDelete: 'CASCADE' });

Oferece.belongsTo(Product, { foreignKey: 'productID' });
Oferece.belongsTo(Loja, { foreignKey: 'cnpjLoja' });

/*
// Mapeando relacionamento Vende
Loja.belongsToMany(Vende, { through: Vende, foreignKey: 'cnpjLoja', onDelete: 'CASCADE' });
Product.belongsToMany(Vende, { through: Vende, foreignKey: 'productID', onDelete: 'CASCADE' });
Cliente.belongsToMany(Vende, { through: Vende, foreignKey: 'clienteID', onDelete: 'CASCADE' });
*/


// Sincroniza o modelo com o banco de dados (cria a tabela)
(async () => {
    try {
        await Product.sync();
        await Loja.sync();
        await Oferece.sync();
        //await Cliente.sync();
        //await Vende.sync();
        console.log('Tables synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing tables:', error);
    }
})();

// Exportando as entidades
exports.productCreate = Product;
exports.lojaCreate = Loja;
//exports.clienteCreate = Cliente;
//exports.vendeCreate = Vende;
exports.ofereceCreate = Oferece;
