const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET = 'ApiDaniela';


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: "Página inicial da api" })
})

//Rota responsável por gerar e exibir o token criado
app.get('/rota1', (req, res) => {
    const token = jwt.sign({ userId: Date.now() }, SECRET, { expiresIn: 300 })
    return res.json({ auth: true, token });
})

// Funcão responsável pela validação do token, caso seja inválido a requisição será interrompida
// Caso seja válida ira decodificar o userId (date.now())
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();

        req.userId = recoded.userId;
        next();
    })
}

// Rota 2, só ira ser acessada se o token for válido e exibira o UserId
app.get('/rota2', verifyJWT, (req, res) => {
    console.log(req.userId + ' Token validado');
})

app.listen(3000, () =>
    console.log("Server foi iniciado :3")
);
