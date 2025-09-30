Blog API

Esta é uma API RESTful para um sistema de blog simples, desenvolvida com Node.js, Express e Prisma. O projeto gerencia três recursos principais: Usuários, Categorias e Postagens.

Tecnologias Utilizadas

- Node.js
- Express.js
- Prisma (ORM)
- PostgreSQL (Banco de Dados)
- Bcrypt.js (para hashing de senhas)

Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Docker](https://www.docker.com/products/docker-desktop/) (para rodar o banco de dados PostgreSQL)
- Um cliente de API como [Insomnia](https://insomnia.rest/download) ou [Postman](https://www.postman.com/downloads/)

⚙️ Configuração e Execução do Projeto

Siga os passos abaixo para rodar o projeto localmente:

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/SEU-USUARIO/blog-api.git](https://github.com/SEU-USUARIO/blog-api.git)
    cd blog-api
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie o banco de dados com Docker:
    Execute o comando abaixo no seu terminal para criar e rodar um container PostgreSQL.
    ```bash
    docker run --name blog-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
    ```

4.  Configure as variáveis de ambiente:
    Crie um arquivo chamado `.env` na raiz do projeto, copie o conteúdo do arquivo `.env.example` (se você tiver um) ou use o modelo abaixo.
    ```
    DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/blogdb?schema=public"
    ```

5.  Execute as migrações do banco de dados:
    Este comando irá criar as tabelas no seu banco de dados com base no schema do Prisma.
    ```bash
    npx prisma migrate dev
    ```

6.  Inicie a API:
    ```bash
    npm run dev
    ```

🚀 O servidor estará rodando em `http://localhost:3000`.

Endpoints da API

A coleção de testes do Insomnia/Postman pode ser encontrada [aqui](LINK_PARA_COLECAO_SE_TIVER).

| Método | Rota                  | Descrição                           |
| :----- | :-------------------- | :---------------------------------- |
| `POST` | `/api/users`          | Cria um novo usuário.               |
| `GET`  | `/api/users`          | Lista todos os usuários.            |
| `POST` | `/api/categories`     | Cria uma nova categoria.            |
| `GET`  | `/api/categories`     | Lista todas as categorias.          |
| `POST` | `/api/posts`          | Cria uma nova postagem.             |
| `GET`  | `/api/posts`          | Lista todas as postagens (com paginação). |
| `GET`  | `/api/users/:id/posts`| Lista todos os posts de um usuário. |
