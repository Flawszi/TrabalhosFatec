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

  static async criar(produto) {
    const { nome, categoria, preco, quantidade } = produto;
    const [result] = await db.query(
      'INSERT INTO produto (nome, categoria, preco, quantidade) VALUES (?, ?, ?, ?)',
      [nome, categoria, preco, quantidade]
    );
    return this.buscarPorId(result.insertId);
  }

  static async atualizar(id, produto) {
    const { nome, categoria, preco, quantidade } = produto;
    const [result] = await db.query(
      'UPDATE produto SET nome = ?, categoria = ?, preco = ?, quantidade = ? WHERE id = ?',
      [nome, categoria, preco, quantidade, id]
    );
    if (result.affectedRows === 0) return null;
    return this.buscarPorId(id);
  }

  static async excluir(id) {
    const [result] = await db.query('DELETE FROM produto WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProdutoDAO;
