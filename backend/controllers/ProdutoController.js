const ProdutoDAO = require('../dao/ProdutoDAO');
const Produto = require('../models/Produto');

class ProdutoController {
  static validarDados({ nome, categoria, preco, quantidade }) {
    const nomeLimpo = String(nome || '').trim();
    const categoriaLimpa = String(categoria || '').trim();
    const precoNumero = Number(preco);
    const quantidadeNumero = Number(quantidade);

    if (!nomeLimpo || !categoriaLimpa) return 'Nome e categoria são obrigatórios.';
    if (nomeLimpo.length > 100 || categoriaLimpa.length > 80) return 'Dados acima do limite permitido.';
    if (!Number.isFinite(precoNumero) || precoNumero < 0) return 'Preço inválido.';
    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero < 0) return 'Quantidade inválida.';
    return null;
  }

  static async listar(req, res) {
    try { res.json(await ProdutoDAO.listarTodos()); }
    catch (erro) { console.error(erro); res.status(500).json({ erro: 'Erro ao listar produtos.' }); }
  }

  static async buscarPorId(req, res) {
    try {
      const produto = await ProdutoDAO.buscarPorId(req.params.id);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
      res.json(produto);
    } catch (erro) { console.error(erro); res.status(500).json({ erro: 'Erro ao buscar produto.' }); }
  }

  static async criar(req, res) {
    try {
      const erroValidacao = ProdutoController.validarDados(req.body);
      if (erroValidacao) return res.status(400).json({ erro: erroValidacao });
      const produto = new Produto(null, String(req.body.nome).trim(), String(req.body.categoria).trim(), Number(req.body.preco), Number(req.body.quantidade));
      res.status(201).json(await ProdutoDAO.criar(produto));
    } catch (erro) { console.error(erro); res.status(500).json({ erro: 'Erro ao cadastrar produto.' }); }
  }

  static async atualizar(req, res) {
    try {
      const erroValidacao = ProdutoController.validarDados(req.body);
      if (erroValidacao) return res.status(400).json({ erro: erroValidacao });
      const produto = new Produto(Number(req.params.id), String(req.body.nome).trim(), String(req.body.categoria).trim(), Number(req.body.preco), Number(req.body.quantidade));
      const atualizado = await ProdutoDAO.atualizar(req.params.id, produto);
      if (!atualizado) return res.status(404).json({ erro: 'Produto não encontrado.' });
      res.json(atualizado);
    } catch (erro) { console.error(erro); res.status(500).json({ erro: 'Erro ao atualizar produto.' }); }
  }

  static async excluir(req, res) {
    try {
      if (!(await ProdutoDAO.excluir(req.params.id))) return res.status(404).json({ erro: 'Produto não encontrado.' });
      res.json({ mensagem: 'Produto excluído com sucesso.' });
    } catch (erro) { console.error(erro); res.status(500).json({ erro: 'Erro ao excluir produto.' }); }
  }
}
module.exports = ProdutoController;
