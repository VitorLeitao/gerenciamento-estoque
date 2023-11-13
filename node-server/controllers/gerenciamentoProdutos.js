// Importando todos os tipos de criaçaõ de entidades
const entidades = require('../models/entidades');

// Criar produtos -> Criar um produto geral que pode ser utilizado por varias lojas
exports.criarProdutoGeral = async (req, res) => {
    try {
        // Criando um produto geral no banco de dados 
        const novoProduto = await entidades.productCreate.create({
            nome: req.body.nome,
            categoria: req.body.categoria,
            descricao: req.body.descricao,
        });
        res.json(novoProduto);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
}

exports.excluirProduto = async (req, res) => {
    try{
        const produto = await entidades.productCreate.findOne({
            where: {
                nome: req.body.nome
            }
        })
        if(!produto){
            return res.json({
                mensagem: "Produto invalido"
            })
        }

        await produto.destroy();
        return res.json({ mensagem: 'Produto excluído com sucesso' });
    }catch(error){
        console.log(error);
        res.status(500).send("Erro Interno so Servidor");
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