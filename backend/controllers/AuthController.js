const bcrypt = require('bcryptjs');
const UsuarioDAO = require('../dao/UsuarioDAO');

class AuthController {
  static async login(req, res) {
    try {
      const email = String(req.body.email || '').trim().toLowerCase();
      const senha = String(req.body.senha || '');

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Informe e-mail e senha.' });
      }

      const usuario = await UsuarioDAO.buscarPorEmail(email);
      if (!usuario || !usuario.ativo) {
        return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
      }

      req.session.regenerate((erro) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao iniciar sessão.' });
        req.session.usuario = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil
        };
        req.session.save((erroSave) => {
          if (erroSave) return res.status(500).json({ erro: 'Erro ao salvar sessão.' });
          res.json({ mensagem: 'Login realizado com sucesso.', usuario: req.session.usuario });
        });
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro interno durante o login.' });
    }
  }

  static me(req, res) {
    if (!req.session?.usuario) return res.status(401).json({ erro: 'Não autenticado.' });
    res.json({ usuario: req.session.usuario });
  }

  static logout(req, res) {
    req.session.destroy((erro) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao encerrar sessão.' });
      res.clearCookie('crud.sid');
      res.json({ mensagem: 'Sessão encerrada.' });
    });
  }
}
module.exports = AuthController;
