# CRUD de Produtos - MVC + DAO + MySQL

Aplicação web completa para cadastro, consulta, edição e exclusão de produtos usando JavaScript no front-end e no back-end.

## Tecnologias
- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MySQL
- mysql2
- MVC
- DAO
- API HTTP REST

## Arquitetura

```text
Front-end (HTML/CSS/JS)
        ↓ fetch / HTTP
Routes (Express)
        ↓
Controller
        ↓
DAO
        ↓
MySQL
```

## CRUD

| Operação | Método | Rota |
|---|---|---|
| Create | POST | /api/produtos |
| Read | GET | /api/produtos |
| Read por ID | GET | /api/produtos/:id |
| Update | PUT | /api/produtos/:id |
| Delete | DELETE | /api/produtos/:id |

## Estrutura

```text
CRUD-Produtos-MVC-JS/
├── backend/
│   ├── config/database.js
│   ├── controllers/ProdutoController.js
│   ├── dao/ProdutoDAO.js
│   ├── models/Produto.js
│   ├── routes/produtoRoutes.js
│   └── server.js
├── database/database.sql
├── frontend/
│   ├── css/style.css
│   ├── js/produtos.js
│   └── index.html
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Como executar

1. Instale Node.js e MySQL.
2. Execute `database/database.sql` no MySQL Workbench.
3. Copie `.env.example` para `.env`.
4. No `.env`, informe usuário e senha do MySQL.
5. Abra o terminal na raiz do projeto e execute:

```bash
npm install
npm start
```

6. Abra no navegador:

```text
http://localhost:3000
```

## Exemplo do .env

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_produtos
PORT=3000
```

## MVC e DAO

- **Model:** `backend/models/Produto.js`, representa Produto.
- **View:** arquivos da pasta `frontend`.
- **Controller:** `backend/controllers/ProdutoController.js`, trata requisições, respostas e validações.
- **DAO:** `backend/dao/ProdutoDAO.js`, executa os comandos SQL no MySQL.

O pacote `mysql2` exerce o papel de tecnologia de acesso ao banco equivalente ao JDBC no ecossistema Node.js.
