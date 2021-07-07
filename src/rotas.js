const express = require('express');
const perfil = require('./controladores/perfil');
const usuarios = require('./controladores/usuarios')
const verificarToken = require('./filtros/verificarToken')

const rotas = express();


rotas.post(`/usuarios`, usuarios.cadastrarUsuario);
rotas.post(`/login`, usuarios.logar);
rotas.use(verificarToken);
rotas.get(`/perfil`, perfil.visualizarPerfil);
rotas.post(`/perfil`, perfil.editarPerfil)



module.exports = rotas;