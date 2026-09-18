const bcrypt = require('bcryptjs');
const UsuarioDAO = require('../dao/UsuarioDAO');
const db = require('../config/database');

async function garantirUsuario(nome, email, senha, perfil) {
  const existente = await UsuarioDAO.buscarPorEmail(email);
  const senhaHash = await bcrypt.hash(senha, 12);
  if (existente) {
    await UsuarioDAO.atualizarSenhaHash(existente.id, senhaHash);
    console.log(`Senha atualizada: ${email}`);
    return;
  }
  await UsuarioDAO.criar({ nome, email, senhaHash, perfil });
  console.log(`Usuário criado: ${email}`);
}

(async () => {
  try {
    await garantirUsuario('Administrador', 'admin@teste.com', 'Admin@123', 'admin');
    await garantirUsuario('Usuário Comum', 'usuario@teste.com', 'Usuario@123', 'usuario');
    console.log('Usuários de demonstração prontos. As senhas foram armazenadas apenas como hash BCrypt.');
  } catch (erro) {
    console.error('Erro ao criar usuários:', erro.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})();
