const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_produtos',
  createDatabaseTable: true
});

app.use(session({
  name: 'crud.sid',
  secret: process.env.SESSION_SECRET || 'troque-esta-chave-em-producao',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 60 * 1000
  }
}));

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente mais tarde.' }
});

app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')));
app.use('/css', express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'frontend', 'js')));
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);

app.get('/', (req, res) => res.redirect(req.session?.usuario ? '/app' : '/login'));
app.get('/login', (req, res) => {
  if (req.session?.usuario) return res.redirect('/app');
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'login.html'));
});
app.get('/app', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'protected', 'dashboard.html'));
});

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

app.listen(PORT, () => console.log(`Servidor seguro executando em http://localhost:${PORT}`));
