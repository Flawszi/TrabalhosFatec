const db = require('../config/database');

class ProdutoDAO {
  static async listarTodos() {
    const [rows] = await db.query('SELECT id, nome, categoria, preco, quantidade FROM produto ORDER BY id DESC');
    return rows;
  }
  static async buscarPorId(id) {
    const [rows] = await db.query('SELECT id, nome, categoria, preco, quantidade FROM produto WHERE id = ?', [id]);
    return rows[0] || null;
  }
  static async criar({ nome, categoria, preco, quantidade }) {
    const [result] = await db.query(
      'INSERT INTO produto (nome, categoria, preco, quantidade) VALUES (?, ?, ?, ?)',
      [nome, categoria, preco, quantidade]
    );
    return this.buscarPorId(result.insertId);
  }
  static async atualizar(id, { nome, categoria, preco, quantidade }) {
    const [result] = await db.query(
      'UPDATE produto SET nome = ?, categoria = ?, preco = ?, quantidade = ? WHERE id = ?',
      [nome, categoria, preco, quantidade, id]
    );
    return result.affectedRows ? this.buscarPorId(id) : null;
  }
  static async excluir(id) {
    const [result] = await db.query('DELETE FROM produto WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
module.exports = ProdutoDAO;
