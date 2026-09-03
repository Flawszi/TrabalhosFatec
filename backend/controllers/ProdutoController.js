const ProdutoDAO = require('../dao/ProdutoDAO');
const Produto = require('../models/Produto');

class ProdutoController {
  static validarDados({ nome, categoria, preco, quantidade }) {
    if (!nome || !categoria || preco === '' || preco === undefined || quantidade === '' || quantidade === undefined) {
      return 'Preencha todos os campos.';
    }

    const precoNumero = Number(preco);
    const quantidadeNumero = Number(quantidade);

    if (Number.isNaN(precoNumero) || precoNumero < 0) {
      return 'O preço deve ser um número maior ou igual a zero.';
    }

    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero < 0) {
      return 'A quantidade deve ser um número inteiro maior ou igual a zero.';
    }

    return null;
  }

  static async listar(req, res) {
    try {
      const produtos = await ProdutoDAO.listarTodos();
      res.json(produtos);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao listar produtos.' });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const produto = await ProdutoDAO.buscarPorId(req.params.id);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
      res.json(produto);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar produto.' });
    }
  }

  static async criar(req, res) {
    try {
      const mensagemErro = ProdutoController.validarDados(req.body);
      if (mensagemErro) return res.status(400).json({ erro: mensagemErro });

      const produto = new Produto(null, req.body.nome.trim(), req.body.categoria.trim(), Number(req.body.preco), Number(req.body.quantidade));
      const produtoCriado = await ProdutoDAO.criar(produto);
      res.status(201).json(produtoCriado);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
    }
  }

  static async atualizar(req, res) {
    try {
      const mensagemErro = ProdutoController.validarDados(req.body);
      if (mensagemErro) return res.status(400).json({ erro: mensagemErro });

      const produto = new Produto(Number(req.params.id), req.body.nome.trim(), req.body.categoria.trim(), Number(req.body.preco), Number(req.body.quantidade));
      const produtoAtualizado = await ProdutoDAO.atualizar(req.params.id, produto);
      if (!produtoAtualizado) return res.status(404).json({ erro: 'Produto não encontrado.' });
      res.json(produtoAtualizado);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao atualizar produto.' });
    }
  }

  static async excluir(req, res) {
    try {
      const excluido = await ProdutoDAO.excluir(req.params.id);
      if (!excluido) return res.status(404).json({ erro: 'Produto não encontrado.' });
      res.json({ mensagem: 'Produto excluído com sucesso.' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao excluir produto.' });
    }
  }
}

module.exports = ProdutoController;
