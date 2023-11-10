// Importando todos os tipos de criaçaõ de entidades
const entidades = require('../models/entidades');

exports.cadastroProdutos = async (req, res) => {
    //res.send(req.body);
    try {
        // Cria uma nova instância de entidades
        const novoProduto = await entidades.productCreate.create({
            nome: req.body.nome,
            categoria: req.body.categoria,
            preco: req.body.preco,
            quantidadeEstoque: req.body.quantidadeEstoque
        });

        res.json(novoProduto);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno do servidor');
    }
}