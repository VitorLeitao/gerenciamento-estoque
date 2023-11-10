const express = require('express');
const route = express.Router();
const gerenciamentoProdutos = require('./controllers/gerenciamentoProdutos')
const paginaInicial = require('./controllers/paginaInicial')


route.get('/', paginaInicial.olaMundo);
route.post('/cadastrar', gerenciamentoProdutos.cadastroProdutos);


module.exports = route;