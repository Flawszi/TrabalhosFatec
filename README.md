# CRUD de Produtos - Segurança, MVC, DAO e MySQL

Versão reforçada do sistema CRUD de produtos para a atividade de segurança e testes.

## Recursos implementados

- Senhas armazenadas somente como hash BCrypt (12 rounds).
- Login com `bcrypt.compare()`; a senha em texto puro nunca é gravada no banco.
- Sessão HTTP com cookie `HttpOnly`, `SameSite=Lax`, expiração de 30 minutos e armazenamento da sessão no MySQL.
- Dois perfis: `admin` e `usuario`.
- `admin`: consulta, cadastro, edição e exclusão de produtos.
- `usuario`: somente consulta.
- Rotas protegidas no servidor; esconder botões no front-end não é usado como única segurança.
- Consultas SQL parametrizadas com `?` para reduzir risco de SQL Injection.
- Validação de entrada no Controller.
- `helmet` para cabeçalhos HTTP de segurança.
- Limite de tentativas na rota de login.
- Página protegida responsiva e com arquivo de logo do cliente.

> **Importante:** `frontend/assets/logo-cliente.svg` é um marcador visual. Substitua pelo arquivo oficial da logo do cliente parceiro antes da entrega, mantendo o mesmo nome ou ajustando o `src` nas páginas.

## 1. Instalação

```bash
npm install
```

## 2. Banco de dados

Execute `database/database.sql` no MySQL Workbench.

## 3. Configuração

Copie `.env.example` para `.env` e configure:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_produtos
PORT=3000
SESSION_SECRET=troque-por-uma-chave-grande-e-aleatoria
NODE_ENV=development
```

Nunca envie o `.env` para o GitHub.

## 4. Criar usuários de teste com hash BCrypt

```bash
npm run seed:users
```

Credenciais de demonstração:

- Admin: `admin@teste.com` / `Admin@123`
- Usuário comum: `usuario@teste.com` / `Usuario@123`

O script gera hashes BCrypt e salva apenas `senha_hash` na tabela `usuario`.

## 5. Executar

```bash
npm start
```

Acesse `http://localhost:3000`.

## Verificação do hash no MySQL

```sql
SELECT id, nome, email, perfil, senha_hash FROM usuario;
```

A coluna `senha_hash` deve conter valores iniciados normalmente por `$2a$` ou `$2b$`, nunca as senhas originais.

## Controle de acesso

| Recurso | Usuário comum | Admin |
|---|---|---|
| Login | Sim | Sim |
| Listar produtos | Sim | Sim |
| Consultar produto | Sim | Sim |
| Cadastrar produto | Não | Sim |
| Editar produto | Não | Sim |
| Excluir produto | Não | Sim |

O servidor retorna HTTP `401` quando não há autenticação e `403` quando o usuário autenticado não possui permissão.

## Estrutura

```text
backend/
  config/
  controllers/
  dao/
  middleware/
  models/
  routes/
  scripts/
database/
frontend/
  assets/
  css/
  js/
  protected/
  public/
```

## Testes recomendados para o PDF

Execute e registre evidências para: login válido, senha incorreta, acesso sem sessão, acesso de usuário comum a POST/PUT/DELETE, entrada inválida, tentativa de SQL Injection, verificação do hash no banco e responsividade em desktop/mobile.
