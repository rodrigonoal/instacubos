const { knex } = require('../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const password = securePassword();

const cadastrarUsuario = async (req, res) => {
    let { username, senha } = req.body;

    username = username.toLowerCase();

    if (!username) {
        return res.status(404).json("O campo username é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    try {
        const usuarios = await knex('usuarios').where({ username }).first();

        if (usuarios) {
            return res.status(400).json("Este nome de usuário já existe.");
        }

        const hash = (await password.hash(Buffer.from(senha))).toString("hex");

        const usuario = await knex('usuarios')
            .returning('*')
            .insert({ username, senha: `${hash}` });

        if (usuario.length === 0) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json('Usuário cadastrado!');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const logar = async (req, res) => {
    let { username, senha } = req.body;

    username = username.toLowerCase();


    if (!username) {
        return res.status(404).json("O campo username é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    try {
        const dadosUsuario = await knex('usuarios').where({ username }).first();

        if (!dadosUsuario) {
            return res.status(400).json("Username e/ou senha incorretos.");
        }

        const { senha: hash } = dadosUsuario;
        const result = await password.verify(Buffer.from(senha), Buffer.from(hash, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('Email ou senha incorretos.');
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hashMelhorada = (await password.hash(Buffer.from(senha))).toString("hex");
                    await knex('usuarios')
                        .where({ username })
                        .update({
                            senha: hashMelhorada
                        })
                } catch {
                };
                break;
        };


        const { senha: senhaUsuario, ...usuario } = dadosUsuario

        const token = jwt.sign({
            usuario
        }, jwtSecret);

        const resposta = {
            usuario,
            token
        };

        return res.status(200).json(resposta);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    cadastrarUsuario,
    logar,
}