const { knex } = require('../conexao');

const visualizarPerfil = async (req, res) => {
    return res.json(req.user)
}

const editarPerfil = async (req, res) => {
    const { id } = req.user;
    const { username, site, bio, telefone, genero, email, imagem } = req.body;

    if (!username && !site && !bio && !telefone && !genero && !email && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do perfil.');
    }

    try {
        if (username) {
            const nomeEmUso = await knex('usuarios').where({ username });

            if (nomeEmUso) {
                return res.status(400).json('O username informado já está em uso por outro usuário.');
            }
        }

        const body = {};

        if (username) {
            body.username = username;
        };

        if (site) {
            body.site = site;
        };

        if (bio) {
            body.bio = bio;
        };

        if (telefone) {
            body.telefone = telefone;
        };

        if (genero) {
            body.genero = genero;
        };

        if (email) {
            body.email = email;
        };

        if (imagem) {
            body.imagem = imagem;
        };

        const perfilAtualizado = await knex('usuarios').where({ id }).update(body)

        if (!perfilAtualizado) {
            return res.status(400).json("Não foi possível atualizar o perfil.");
        }

        return res.status(200).json('Perfil atualizado com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    visualizarPerfil,
    editarPerfil
}