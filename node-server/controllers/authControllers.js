const entidades = require('../models/entidades');
// Criptografia da senha]
const bcrypt = require('bcrypt');
// Biblioteca para gerar o token
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()

const SECRET = 'Teste';

exports.login = async (req, res) => {
    try {
        const loja = await entidades.lojaCreate.findOne({
            where: {cnpjLoja: req.body.cnpj}
        })

        if(!loja){
            return res.status(401).json({
                statusCode: 401,
                message: "Usuário não encontrado!",
                data: {
                    cnpj: req.body.cnpj
                }
            })
        }
        
        const validacaoPassword = bcrypt.compareSync(req.body.senha, loja.senha);
        if (!validacaoPassword) {
            return res.status(401).json({
                statusCode: 401,
                message: "Não autorizado!",
            })
        }
        // Criando o token
        const token = jwt.sign({name: loja.nome}, SECRET,{
            expiresIn: 4 * 60 // 4 minutos
        })

        res.status(200).json({
            statusCode: 200,
            message: "Login realizado com sucesso!",
            data: {
                token
            }
        })
        

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
}


// Rota middleware para verificar se o token está valido quando acessarmos certas rotas
exports.verificarToken = (req, res, next) => {

    const tokenHeader = req.headers["authorization"];
    console.log(tokenHeader);
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            statusCode: 401,
            message: "Não aaautorizado!",
        })
    }

    try {

        jwt.verify(token, SECRET);
        next();
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            message: "Token não valido."
        })
    }

}