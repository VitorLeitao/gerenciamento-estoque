const Sequelize = require('sequelize');

const conexao = new Sequelize("products", 'root', 'Vitor_m26', {
    host: 'localhost',
    dialect: 'mysql'
});

conexao.authenticate()
.then(function(){
    console.log('Deu certo');
}).catch(function(){
    console.log('Deu errado');
})
module.exports = conexao;

