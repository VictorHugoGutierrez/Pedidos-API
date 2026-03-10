# 📦 API de Gestão de Pedidos (Pedidos-API)

Uma API RESTful robusta e de alta performance desenvolvida em Node.js. O objetivo principal desta API é processar, transformar e gerir pedidos.

---

## 🚀 Tecnologias Utilizadas

* **Node.js** (JavaScript/ES Modules)
* **Fastify:** Framework web focado em extrema performance e baixo custo de processamento.
* **Prisma ORM:** Ferramenta de mapeamento objeto-relacional que garante tipagem e segurança na manipulação de dados.
* **SQLite:** Base de dados relacional leve (configurada para facilitar a execução e testes locais).
* **Swagger (@fastify/swagger):** Documentação interativa e gerada automaticamente a partir do código.
* **JWT (@fastify/jwt):** Autenticação e proteção de todas as rotas da API.

---

## 🎯 Funcionalidades Implementadas

### Requisitos Principais:
- [x] Rota `POST` para receção de JSON.
- [x] Tratamento e normalização do payload.
- [x] Persistência em base de dados relacional (Tabelas `Order` e `Items`).
- [x] Rotas CRUD completas para gestão de pedidos:
  - `GET /order/list` (Listar todos os pedidos)
  - `GET /order/:orderId` (Buscar um pedido específico e os seus itens)
  - `PUT /order/:orderId` (Atualizar dados de um pedido existente)
  - `DELETE /order/:orderId` (Remover um pedido)

---

## 📁 Estrutura do Projeto

A arquitetura foi desenhada para manter a responsabilidade única de cada ficheiro e facilitar a manutenção:

```text
├── prisma/
│   ├── schema.prisma      # Modelagem das tabelas Order e Items
├── src/
│   ├── lib/
│   │   └── prisma.js      # Instância única de conexão com a base de dados
│   ├── routes/
│   │   ├── auth.js        # Rota de geração de Token JWT (Login)
│   │   ├── createOrder.js # POST /order
│   │   ├── getOrder.js    # GET /order/:orderId
│   │   ├── getAllOrders.js# GET /order/list
│   │   ├── updateOrder.js # PUT /order/:orderId
│   │   └── deleteOrder.js # DELETE /order/:orderId
│   ├── utils/
│   │   └── mappingData.js # Regras de negócio e transformação VTEX -> DB
│   └── server.js          # Ponto de entrada principal e configuração do Fastify
├── .env                   # Ficheiro de variáveis de ambiente (não versionado)
├── package.json
└── README.md
```
---

## ⚙️ Como executar o projeto localmente

### 1. Pré-requisitos
Certifica-te de que tens o **Node.js** instalado na tua máquina (versão 18 ou superior recomendada).

### 2. Instalação e Configuração
Clona o repositório e instala as dependências:
```
git clone https://github.com/VictorHugoGutierrez/Pedidos-API.git
cd Pedidos-API
npm install
```
Cria um ficheiro chamado .env na raiz do projeto e adiciona a tua chave secreta para o JWT:
```
SECRET_KEY="tua_chave_super_secreta_aqui"
````

### 3. Configurar a Base de Dados
Sincroniza o modelo do Prisma com a base de dados SQLite local e gera o cliente:

```
npx prisma db push
npx prisma generate
````

### 4. Iniciar o Servidor
Para iniciar a API em modo de desenvolvimento:

```
npm run dev
```
(O servidor ficará disponível em http://localhost:3000)

---

## 🔒 Autenticação e Testes via Swagger (Navegador)

A API possui uma documentação interativa onde podes testar todas as rotas diretamente pelo navegador.

1. Com o servidor a correr, acede a: **`http://localhost:3000/docs`**
2. **Gerar o Token:**
   - Vai à rota pública `POST /login`.
   - Clica em *"Try it out"* e executa com o body padrão (`username: admin`, `password: 123456`).
   - Copia o `token` devolvido na resposta.
3. **Autenticar:**
   - No topo da página do Swagger, clica no botão verde **Authorize**.
   - Digita `Bearer ` (com espaço) seguido do token que copiaste (Ex: `Bearer eyJhbG...`).
   - Clica em *Authorize*. Agora todas as rotas com cadeado estarão desbloqueadas para teste!
