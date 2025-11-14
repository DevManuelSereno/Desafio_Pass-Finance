# 🚀 Pass Finance - Sistema de Gestão Financeira

Um sistema full-stack moderno para gestão de contas a pagar, construído com as tecnologias mais recentes, incluindo Next.js 16 (App Router), React 19, TypeScript e Prisma ORM.

[![Status: Em Desenvolvimento](https://img.shields.io/badge/status-em_desenvolvimento-yellow.svg)](https://github.com/Manuel-Sereno/pass-finance) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📑 Visão Geral

O **Pass Finance** é um sistema de gestão financeira focado em contas a pagar. Ele utiliza uma arquitetura full-stack com o **Next.js App Router**, combinando renderização server-side (SSR) e client-side (CSR). O projeto foi desenvolvido com foco em performance, tipagem estrita com TypeScript e boas práticas de código.

## ✨ Funcionalidades Principais

* **Gestão de Contas:** CRUD completo para contas a pagar.
* **Gestão de Pagamentos:** Registro de pagamentos parciais ou totais, com atualização automática de saldo.
* **Parcelamento:** Cadastro de contas parceladas com cálculo automático.
* **Dashboard Analítico:** Gráficos com totais pendentes, pagos e gastos por classificação.
* **Exportação de Dados:** Geração de relatórios em formato `.csv` com formatação em português (UTF-8 com BOM).
* **Interface Moderna:**
    * Tema Dark/Light com persistência.
    * Internacionalização (PT/EN/ES).
    * Design responsivo.
* **Busca e Filtros:** Paginação no backend e filtros avançados na interface.

## 🛠️ Stack Tecnológica

A stack é dividida entre frontend, backend e banco de dados, utilizando o Next.js de forma full-stack.

### Frontend
* **Next.js 16** (com App Router)
* **React 19**
* **TypeScript 5**
* **Tailwind CSS 4**
* **Shadcn/UI** (Componentes)
* **Radix UI** (Primitivas de UI)
* **Lucide React** (Ícones)
* **PapaParse** (Parser CSV)

### Backend
* **Next.js 16 API Routes**
* **Prisma ORM 6**
* **Zod** (Validação de schemas)

### Banco de Dados
* **PostgreSQL**

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/pass-finance.git](https://github.com/seu-usuario/pass-finance.git)
    cd pass-finance
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione a sua string de conexão do PostgreSQL:
    ```.env
    DATABASE_URL="postgresql://user:password@localhost:5432/passfinance"
    ```

4.  **Execute as migrações do banco:**
    Isso irá criar as tabelas no seu banco de dados com base no `schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **Gere o cliente do Prisma:**
    ```bash
    npx prisma generate
    ```

6.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:3000`.

## ⚙️ Scripts Úteis

* `npm run dev`: Inicia o servidor de desenvolvimento.
* `npm run build`: Gera a build de produção.
* `npm run start`: Inicia um servidor de produção.
* `npx prisma studio`: Abre a interface visual do Prisma para gerenciar o banco.
* `npx prisma migrate deploy`: Aplica migrações em um ambiente de produção (ex: Vercel).

## 🗺️ Roadmap Futuro

O projeto é escalável e possui um roadmap claro para novas funcionalidades:

* [ ] Autenticação de usuários (JWT ou NextAuth)
* [ ] Gestão de Contas a Receber
* [ ] Geração de relatórios em PDF
* [ ] Anexo de arquivos (comprovantes)
* [ ] Notificações de vencimento
* [ ] Testes unitários (Jest/Vitest) e E2E (Cypress/Playwright)

## 📖 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por **Manuel Sereno** | © 2025