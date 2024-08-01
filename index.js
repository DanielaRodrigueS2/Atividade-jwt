const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Declaração do jwt que será utilizado
const app = express();
const mustacheExpress = require('mustache-express');
const engine = mustacheExpress();

app.engine("mustache", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

const SECRET = 'ApiDaniela'; //Declaração da constante SECRET

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('valida');
})

//Rota responsável por gerar e exibir o token criado
app.get('/rota1', (req, res) => {
    const token = jwt.sign({ userId: Date.now() }, SECRET, { expiresIn: 300 })
    return res.json({ auth: true, token })
})

// Rota responsável por receber o token por body e atribuir ao header x-access-token
app.post('/validatoken', (req, res) => {
    const token = req.body.token;
    console.log(token);
    res.setHeader('x-access-token', token);
    console.log(req.headers['x-access-token']);
    return res.status(200).send('Token set in header');
})

// Funcão responsável pela validação do token, caso seja inválido a requisição será interrompida
// Caso seja válida ira decodificar o userId (date.now())
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, recoded) => {
        if (err) return res.status(401).end();

        req.userId = recoded.userId;
        next();
    })
}

// Rota 2, só ira ser acessada se o token for válido e exibira o UserId
app.get('/rota2', verifyJWT, (req, res) => {
    res.status(200).send(`UserId: ${req.userId} - Token validado`);
})

app.listen(3000, () =>
    console.log("Server foi iniciado :3")
);
