// Importando todos os tipos de criaçaõ de entidades
const entidades = require('../models/entidades');

// Refatoração -> colocar as funções (!value) pra fora

// Cadastro de produtos -> Loja vai começar a oferecer um certo produto no seu estoque e colocar um preço para ele
exports.cadastroProdutosEstoque = async (req, res) => {
    //res.send(req.body);
    try {
        const produtoCadastrado = await entidades.productCreate.findOne({
            where: { nome: req.body.nome }
        })

        if (!produtoCadastrado) {
            res.send('Esse produto nao existe!');
        }

        // Criando um estoque para esse produto
        const novoEstoque = await entidades.ofereceCreate.create({
            productID: produtoCadastrado.productID,
            cnpjLoja: req.body.cnpjLoja,
            quantidadeEstoque: req.body.quantidadeEstoque,
            precoProduto: req.body.preco
        });

        res.json(novoEstoque);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
}
// Todos os produtos

// Consultar todos os produtos de uma loja
exports.consultarProdutosCnpj = async (req, res) => {
    try {
        const cnpjLojaFiltro = req.params.cnpj;
        // Vamos fazer um inner join entre a entidade vende e products para conseguir pegar as informações dos produtos com base em um cnpj especifico
        entidades.ofereceCreate.findAll({
            // Unindo com produto
            include: [{
                model: entidades.productCreate,
                attributes: ['nome', 'categoria', 'descricao', 'url'],
            }],
            attributes: ['precoProduto', 'quantidadeEstoque'],
            where: {
                cnpjLoja: cnpjLojaFiltro,
            }
        })
            .then((result) => {
                res.send(result);
            })
            .catch((error) => {
                res.send('Erro Interno doooo Servidor');
                console.log('Cheguei aqui');
                console.log(error);
            })


    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno do servidor');
    }
}

// Excluir produto do estoque -> Loja parar de vender o produto
exports.cancelarOfertaProduto = async (req, res) => {
    try {
        // primeiro vamos pegar o id do produto com base no nome 
        const produto = await entidades.productCreate.findOne({
            where: { nome: req.body.nomeProduto }
        });
        if (!produto) {
            return res.json({ mensagem: 'Produto Inválido. Digite novamente' });
        }

        // Vamos excluir um produto de ID X para a loja desejada
        const produtoEstoque = await entidades.ofereceCreate.findOne({
            where:
            {
                productID: produto.productID,
                cnpjLoja: req.body.cnpj
            }
        })
        if (!produtoEstoque) {
            return res.json({ mensagem: 'Produto não encontrado na loja' });
        }

        await produtoEstoque.destroy();
        return res.json({ mensagem: 'Produto excluído com sucesso' });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Erro interno do servidor');
    }
}

// Efetuar Venda -> Diminuir o numero de peças no estoque de uma loja especificada
exports.reajusteEstoque = async (req, res) => {
    try {

        // Pegando o produto com base em seu nome
        const produto = await entidades.productCreate.findOne({
            where: { nome: req.body.nomeProduto }
        })
        if (!produto) {
            return res.json({ mensagem: "Produto invalido, digite novamente." });
        }

        // Instanciando a oferta do produto e diminuindo o numero do estoque
        const ofertaProduto = await entidades.ofereceCreate.findOne({
            where: {
                productID: produto.productID,
                cnpjLoja: req.body.cnpj
            }
        })
        if (!ofertaProduto) {
            return res.json({ mensagem: "Produto nao cadastrado no seu estoque, digite novamente." });
        }

        console.log(req.body.tipoReajuste);
        if (req.body.tipoReajuste === 'fornecimento') {
            const quantidadeVendas = Number(req.body.quantidadeMudanca);

            // Efetuando a diminuicao
            ofertaProduto.quantidadeEstoque += quantidadeVendas;
            await ofertaProduto.save();
            return res.json({ "nova quantidade disponivel no estoque: ": ofertaProduto.quantidadeEstoque });
        } else {
            // Verificando se a quantidade de produtos no estoque é valida
            const quantidadeVendas = Number(req.body.quantidadeMudanca);
            if (ofertaProduto.quantidadeEstoque - quantidadeVendas < 0) {
                return res.json({ mensagem: "Numero de vendas invalidas, voce nao possui estoque suficiente desse produto" });
            }

            // Efetuando a diminuicao
            ofertaProduto.quantidadeEstoque -= quantidadeVendas;
            await ofertaProduto.save();
            return res.json({ "nova quantidade disponivel no estoque: ": ofertaProduto.quantidadeEstoque });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send('Erro interno do servidor');
    }
}


// Reajuste de Preço
exports.reajustePreco = async (req, res) => {
    try {
        const produto = await entidades.productCreate.findOne({
            where: { nome: req.body.nomeProduto }
        });
        if (!produto) {
            return res.json({ mensagem: "Produto Não registrado no sistema, digite novamente" });
        }
        const estoqueProduto = await entidades.ofereceCreate.findOne({
            where: {
                productID: produto.productID,
                cnpjLoja: req.body.cnpj
            },
        })
        if (!estoqueProduto) {
            return res.json({ mensagem: "Sua loja nao tem esse produto no estoque, digite novamente" });
        }

        const reajustePorcentagem = Number(req.body.porcentagemMudanca) / 100;
        if (req.body.tipoReajuste === "aumento") {
            estoqueProduto.precoProduto += (estoqueProduto.precoProduto * reajustePorcentagem);
        } else {
            estoqueProduto.precoProduto -= (estoqueProduto.precoProduto * reajustePorcentagem);
        }
        await estoqueProduto.save();
        return res.json({ "Novo preço do produto: ": estoqueProduto.precoProduto });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Erro interno do servidor");
    }
}


