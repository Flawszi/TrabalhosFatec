function requireAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    if (req.path.startsWith('/api') || req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ erro: 'Autenticação necessária.' });
    }
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ erro: 'Autenticação necessária.' });
  }
  if (req.session.usuario.perfil !== 'admin') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para administradores.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
