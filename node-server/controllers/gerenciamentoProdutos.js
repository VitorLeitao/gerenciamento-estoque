// Importando todos os tipos de criaçaõ de entidades
const entidades = require('../models/entidades');


// Cadastro de produtos
// Adiconar a criação do estoque para esse produto
exports.cadastroProdutos = async (req, res) => {
    //res.send(req.body);
    try {
        // Cadastrando o produto no banco de dados 
        const novoProduto = await entidades.productCreate.create({
            nome: req.body.nome,
            categoria: req.body.categoria,
            descricao: req.body.descricao,
            preco: req.body.preco,
        });

        // Cadastrando esse produto no estoque
        const novoEstoque = await entidades.ofereceCreate.create({
            productID: novoProduto.productID,
            cnpjLoja: req.body.cnpjLoja,
            quantidadeEstoque: req.body.quantidadeEstoque,
        });

        res.json({
            novoProduto: novoProduto,
            novoEstoque: novoEstoque
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
}

// Consultar todos os produtos de uma loja
exports.consultarProdutosCnpj = async (req, res) => {
    try{
        const cnpjLoja = req.paramns.cnpj;
        

    }catch(error){
        res.status(500).send('Erro interno do servidor');
    }
}


/*
Usar isso no delete producs:
// Desativa as verificações de chave estrangeira
await db.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

// Trunca a tabela
await Product.destroy({ truncate: true });

// Ativa as verificações de chave estrangeira novamente
await db.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

*/