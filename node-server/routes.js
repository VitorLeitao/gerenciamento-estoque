const express = require('express');
const route = express.Router();
const gerenciamentoProdutos = require('./controllers/gerenciamentoProdutos')
const gerenciamentoEstoque = require('./controllers/gerenciamentoEstoque')
const gerenciamentoLojas = require('./controllers/gerenciamentoLojas')
const paginaInicial = require('./controllers/paginaInicial')


route.get('/', paginaInicial.olaMundo);
// Rotas de gerenciamento de produtos
route.post('/criarProdutoGeral', gerenciamentoProdutos.criarProdutoGeral)

// Rotas para gerenciamento de estoque
route.post('/cadastroProdutosEstoque', gerenciamentoEstoque.cadastroProdutosEstoque);
route.get('/produtosByCNPJ/:cnpj', gerenciamentoEstoque.consultarProdutosCnpj);
route.delete('/cancelarOfertaProduto', gerenciamentoEstoque.cancelarOfertaProduto);
route.put('/efetuarVenda', gerenciamentoEstoque.efetuarVenda);
route.put('/efetuarFornecimento', gerenciamentoEstoque.efetuarFornecimento);

// Rotas de gerenciamento de lojas
route.post('/cadastrarLoja', gerenciamentoLojas.cadastroLoja);


module.exports = route;