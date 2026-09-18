const db = require('../config/database');

class UsuarioDAO {
  static async buscarPorEmail(email) {
    const [rows] = await db.query(
      'SELECT id, nome, email, senha_hash, perfil, ativo FROM usuario WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  }

  static async criar({ nome, email, senhaHash, perfil }) {
    const [result] = await db.query(
      'INSERT INTO usuario (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, perfil]
    );
    return result.insertId;
  }

  static async atualizarSenhaHash(id, senhaHash) {
    await db.query('UPDATE usuario SET senha_hash = ? WHERE id = ?', [senhaHash, id]);
  }
}
module.exports = UsuarioDAO;
