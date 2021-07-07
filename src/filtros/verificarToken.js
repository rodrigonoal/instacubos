const { knex } = require('../conexao');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');
const conexao = require('../conexao');

const verificarToken = async (req, res, next) => {

    const { authorization } = req.headers;

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { usuario: { id, username } } = jwt.verify(token, jwtSecret);

        const autenticado = await knex('usuarios').where({ id, username }).first()

        if (!autenticado) {
            return res.status(404).json(`Você precisa estar logado para acessar este recurso.`);
        };

        const { senha: senhaUsuario, ...usuario } = autenticado

        req.user = usuario

        next();

    } catch (error) {
        return res.status(400).json(error.message);
    };
};

module.exports = verificarToken;