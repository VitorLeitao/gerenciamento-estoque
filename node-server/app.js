const express = require('express');
const bodyParser = require('body-parser');
const route = express.Router();
const cors = require('cors');  // Adicione esta linha para importar o módulo 'cors'
const routes = require('./routes');


const app = express();

// Configuração do CORS: Aceitar requisições do front end
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Fazendo o server utilizar as rotas
app.use(routes);

app.listen(2800, ()=>{
    console.log('Servidor iniciado!');
})
