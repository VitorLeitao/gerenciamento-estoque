const express = require('express');
const route = express.Router();
const gerenciamentoProdutos = require('./controllers/gerenciamentoProdutos')
const gerenciamentoEstoque = require('./controllers/gerenciamentoEstoque')
const gerenciamentoLojas = require('./controllers/gerenciamentoLojas')
const auth = require('./controllers/authControllers')

// Rotas de gerenciamento de produtos
route.post('/criarProdutoGeral',auth.verificarToken, gerenciamentoProdutos.criarProdutoGeral);
route.delete('/excluirProdutoGeral', gerenciamentoProdutos.excluirProduto);

// Rotas para gerenciamento de estoque
route.post('/cadastroProdutosEstoque', gerenciamentoEstoque.cadastroProdutosEstoque);
// Colocamos uma rota middle para validar o token
route.get('/produtosByCNPJ/:cnpj', auth.verificarToken, gerenciamentoEstoque.consultarProdutosCnpj);
route.get('/produtosNaoOfertados/:cnpj', auth.verificarToken, gerenciamentoEstoque.produtosNaoOfertados);
route.delete('/cancelarOfertaProduto', gerenciamentoEstoque.cancelarOfertaProduto);
route.put('/alterarEstoque', gerenciamentoEstoque.reajusteEstoque);
route.put('/reajustePreco', gerenciamentoEstoque.reajustePreco);


// Rotas de gerenciamento de lojas
route.post('/cadastrarLoja', gerenciamentoLojas.cadastroLoja);
// Autenticação de lojas
route.post('/loginloja', auth.login);


module.exports = route;