# ServeRest API Tests — Banco Carrefour

Projeto de automação de testes de API para cadastrar, consultar, atualizar e remover usuarios, cobrindo **100% dos endpoints de usuários** com **Jest + Axios + Allure Report**.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Node.js | 20+ | Ambiente de execução |
| Jest | 29.x | Test runner e asserções |
| Axios | 1.7.x | Requisições HTTP |
| allure-jest | 3.x | Integração Allure com Jest |
| jest-junit | 16.x | Relatório JUnit XML para CI |
| allure-commandline | latest | Geração do relatório HTML |

---

## Pré-requisitos

- **Node.js 20+**: [Download](https://nodejs.org/)
- **Allure CLI** (para visualizar relatórios): [Instalação](https://allurereport.org/docs/install/)

### Verificar instalações

```bash
node -v
npm -v
allure --version
```

---

## Estrutura do Projeto

```
test/
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
├── .gitignore
├── jest.config.js                      # Configuração Jest + Allure + JUnit
├── package.json
└── README.md
```

---

## Instalação

```bash
cd test
npm install
```

---

## Como Executar os Testes

### Executar todos os testes

```bash
npm test
```

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

### Executar e gerar relatório Allure

```bash
npm run report
```

### Visualizar relatório Allure no browser

```bash
npm run allure:serve
```

### Abrir relatório já gerado

```bash
npm run allure:open
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

**Total: 37 testes — cobertura 100% dos endpoints de usuários**

---

## Relatórios Gerados

| Tipo | Caminho | Usado em |
|------|---------|----------|
| Allure Results (JSON) | `allure-results/` | Geração do HTML |
| Allure Report (HTML) | `allure-report/index.html` | Visualização local e CI |
| JUnit XML | `reports/junit-report.xml` | GitHub Actions Summary |

---

## Pipeline CI/CD (GitHub Actions)

O arquivo [.github/workflows/ci.yml](.github/workflows/ci.yml) executa:

1. Checkout do repositório
2. Configuração do Node.js 20 com cache npm
3. `npm install` — instala dependências
4. `npm test` — executa todos os testes
5. Geração do relatório Allure HTML
6. Publicação dos artefatos no GitHub Actions (30 dias)
7. Deploy automático do relatório no GitHub Pages (branch `main`/`master`)

### Artefatos publicados no CI

- `allure-report-{run}` — Relatório HTML Allure completo
- `junit-report-{run}` — Relatório JUnit XML

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
