const express = require('express');
const route = express.Router();
const gerenciamentoProdutos = require('./controllers/gerenciamentoProdutos')
const gerenciamentoLojas = require('./controllers/gerenciamentoLojas')
const paginaInicial = require('./controllers/paginaInicial')


route.get('/', paginaInicial.olaMundo);
// Rotas de gerenciamento de produtos
route.post('/cadastrarProduto', gerenciamentoProdutos.cadastroProdutos);

// Rotas de gerenciamento de lojas
route.post('/cadastrarLoja', gerenciamentoLojas.cadastroLoja);


module.exports = route;