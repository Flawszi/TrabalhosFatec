const express = require('express');
const ProdutoController = require('../controllers/ProdutoController');

const router = express.Router();
router.get('/', ProdutoController.listar);
router.get('/:id', ProdutoController.buscarPorId);
router.post('/', ProdutoController.criar);
router.put('/:id', ProdutoController.atualizar);
router.delete('/:id', ProdutoController.excluir);

module.exports = router;
