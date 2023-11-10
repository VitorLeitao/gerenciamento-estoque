const express = require('express');
const bodyParser = require('body-parser');
const route = express.Router();
const routes = require('./routes');


const app = express();
app.use(bodyParser.json());

// Fazendo o server utilizar as rotas
app.use(routes);

app.listen(3000, ()=>{
    console.log('Servidor iniciado!');
})
