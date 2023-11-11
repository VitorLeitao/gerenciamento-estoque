// Importando todos os tipos de criaçaõ de entidades
const entidades = require('../models/entidades');

// Cadastro de loja
exports.cadastroLoja = async (req, res) => {
    //res.send(req.body);
    try {
        // Cria uma nova instância de entidades
        const novaLoja = await entidades.lojaCreate.create({
            cnpjLoja: req.body.cnpjLoja,
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            ramo: req.body.ramo,
        });

        res.json(novaLoja);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
}