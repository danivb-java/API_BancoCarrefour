# ServeRest API Tests — Banco Carrefour

Projeto de automação de testes de API para cadastrar, consultar, atualizar e remover usuários, cobrindo **100% dos endpoints de usuários** com **Jest + Axios + jest-html-reporters**.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Node.js | 20+ | Ambiente de execução |
| Jest | 29.x | Test runner e asserções |
| Axios | 1.7.x | Requisições HTTP |
| jest-html-reporters | 3.x | Geração de relatório HTML |

---

## Pré-requisitos

- **Node.js 20+**: [Download](https://nodejs.org/)

### Verificar instalação

```bash
node -v
npm -v
```

---

## Estrutura do Projeto

```
API_BancoCarrefour/
├── .github/
│   └── workflows/
│       └── ci.yml                      # Pipeline GitHub Actions
├── src/
│   ├── config/
│   │   └── baseConfig.js               # Configuração base, helpers HTTP
│   └── tests/
│       ├── listaUsers.test.js          # GET /usuarios
│       ├── criaUsers.test.js           # POST /usuarios
│       ├── consultaUser.test.js        # GET /usuarios/{id}
│       ├── atualizaUser.test.js        # PUT /usuarios/{id}
│       └── deletaUser.test.js          # DELETE /usuarios/{id}
├── reports/                            # Relatório HTML gerado após npm test
├── .gitignore
├── jest.config.js                      # Configuração Jest + jest-html-reporters
├── package.json
└── README.md
```

---

## Instalação

```bash
npm install
```

---

## Como Executar os Testes

### Executar todos os testes

```bash
npm test
```

O relatório HTML é gerado automaticamente em `reports/mochawesome.html` ao final da execução.

### Executar com saída detalhada

```bash
npm run test:verbose
```

### Executar arquivo específico

```bash
npx jest src/tests/listaUsers.test.js
npx jest src/tests/criaUsers.test.js
npx jest src/tests/consultaUser.test.js
npx jest src/tests/atualizaUser.test.js
npx jest src/tests/deletaUser.test.js
```

---

## Cobertura de Testes

### GET /usuarios — 8 testes

| # | Cenário | Status |
|---|---------|--------|
| 1 | Listar todos com campos `quantidade` e `usuarios` | 200 |
| 2 | Quantidade igual ao tamanho do array | 200 |
| 3 | Filtrar por nome | 200 |
| 4 | Filtrar por email | 200 |
| 5 | Filtrar por `administrador=true` | 200 |
| 6 | Filtrar por `administrador=false` | 200 |
| 7 | Filtrar por `_id` | 200 |
| 8 | Nome inexistente retorna lista vazia | 200 (quantidade = 0) |

### POST /usuarios — 10 testes

| # | Cenário | Status |
|---|---------|--------|
| 1 | Criar usuário administrador | 201 |
| 2 | Criar usuário não-administrador | 201 |
| 3 | Email duplicado | 400 |
| 4 | Sem campo `nome` | 400 |
| 5 | Sem campo `email` | 400 |
| 6 | Sem campo `password` | 400 |
| 7 | Sem campo `administrador` | 400 |
| 8 | Email com formato inválido | 400 |
| 9 | Body vazio `{}` | 400 |
| 10 | Validar campos `message` e `_id` na resposta | 201 |

### GET /usuarios/{id} — 6 testes

| # | Cenário | Status |
|---|---------|--------|
| 1 | Buscar por ID existente | 200 |
| 2 | Todos os campos obrigatórios presentes | 200 |
| 3 | ID inexistente | 400 |
| 4 | Campo `message` no erro | 400 |
| 5 | Campo `administrador` correto | 200 |
| 6 | Email igual ao cadastrado | 200 |

### PUT /usuarios/{id} — 8 testes

| # | Cenário | Status |
|---|---------|--------|
| 1 | Atualizar usuário existente | 200 |
| 2 | Confirmar dados atualizados via GET | 200 |
| 3 | PUT com ID inexistente cria novo usuário | 201 |
| 4 | Email de outro usuário | 400 |
| 5 | Sem campo `nome` | 400 |
| 6 | Sem campo `email` | 400 |
| 7 | Campo `message` na resposta de atualização | 200 |
| 8 | Campos `message` e `_id` na criação via PUT | 201 |

### DELETE /usuarios/{id} — 5 testes

| # | Cenário | Status |
|---|---------|--------|
| 1 | Excluir usuário existente | 200 |
| 2 | Confirmar exclusão via GET | 400 |
| 3 | ID inexistente retorna 200 | 200 |
| 4 | Campo `message` presente na resposta | 200 |
| 5 | Usuário com carrinho cadastrado | 400 |

**Total: 38 testes — cobertura 100% dos endpoints de usuários**

---

## Relatório Gerado

Após executar `npm test`, o relatório HTML é gerado em:

```
reports/
├── mochawesome.html                    # Abrir no navegador
└── jest-html-reporters-attach/
    └── mochawesome/
        └── index.js                   # Assets do relatório
```

> Abra `reports/mochawesome.html` no navegador para visualizar o relatório.

---

## Pipeline CI/CD (GitHub Actions)

O arquivo [.github/workflows/ci.yml](.github/workflows/ci.yml) executa automaticamente a cada push ou pull request:

1. Checkout do repositório
2. Configuração do Node.js 20 com cache npm
3. `npm install` — instala dependências
4. `npm test` — executa todos os testes e gera o relatório HTML
5. Publicação do relatório como artefato no GitHub Actions (30 dias de retenção)
6. Deploy automático do relatório no GitHub Pages

### Artefato publicado no CI

- `mochawesome-report-{run}` — Relatório HTML completo (pasta `reports/`)

### Relatório online (GitHub Pages)

Após cada execução na branch `main` ou `master`, o relatório é publicado em:

```
https://danivb-java.github.io/API_BancoCarrefour/
```

> **Pré-requisito:** GitHub Pages deve estar habilitado em **Settings → Pages → Source: gh-pages / root**.

---

## Configuração da API

Todas as configurações ficam em [src/config/baseConfig.js](src/config/baseConfig.js):

| Variável | Valor padrão | Descrição |
|----------|-------------|-----------|
| `BASE_URL` | `https://serverest.dev` | URL base da API |
| `ADMIN_EMAIL` | `fulano@qa.com` | Email para autenticação |
| `ADMIN_PASSWORD` | `teste` | Senha para autenticação |

---

## Repositório

- GitHub: [danivb-java](https://github.com/danivb-java)
- API testada: [ServeRest](https://serverest.dev)
