# **Devmark - Backend API** ⚙️
*Serviço RESTful em NestJS da Plataforma Devmark*

Este é o servidor backend (API) da plataforma **Devmark**. Ele foi projetado em arquitetura modular utilizando o framework **NestJS**, provendo recursos de autenticação, banco de dados relacional PostgreSQL via **Prisma ORM**, e agendamento/planejamento inteligente assistido por inteligência artificial (modelos **Google Gemini** e **OpenRouter**).

---

### **Sumário**
1. [Stack Tecnológica](#stack-tecnológica)
2. [Variáveis de Ambiente](#variáveis-de-ambiente)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Execução da Aplicação](#execução-da-aplicação)
5. [Endpoints e Módulos Principais](#endpoints-e-módulos-principais)
6. [Integração de Inteligência Artificial](#integração-de-inteligência-artificial)
7. [Documentação da API (Swagger)](#documentação-da-api-swagger)

---

### **Stack Tecnológica**

O backend baseia-se em tecnologias consolidadas para aplicações robustas em TypeScript:

*   **NestJS 11**: Framework modular que adota boas práticas de injeção de dependência e arquitetura escalável.
*   **Prisma ORM**: Object-Relational Mapping (ORM) tipado para facilitar consultas seguras no PostgreSQL.
*   **PostgreSQL**: Banco de dados relacional de alta confiabilidade.
*   **Passport & JWT**: Autenticação stateless com tokens trafegados por meio de cookies seguros (`HttpOnly`).
*   **class-validator & class-transformer**: Validação em tempo de execução dos dados de entrada utilizando decorators do TypeScript.
*   **Google GenAI SDK**: Cliente oficial para a API do Google Gemini.

---

### **Variáveis de Ambiente**

Antes de executar o servidor, você deve criar um arquivo `.env` na raiz de `/api`. Um modelo de preenchimento está estruturado abaixo:

```env
# Porta do Servidor API
PORT=3000

# Conexão com o Banco de Dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/devmark?schema=public"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/devmark?schema=public"

# Configuração de Segurança (JWT)
JWT_SECRET="insira_uma_chave_secreta_longa_e_segura_aqui"
JWT_EXPIRES_IN="7d"

# Integrações de Inteligência Artificial (Opcional, insira pelo menos uma)
GEMINI_API_KEY="sua_chave_do_google_gemini_aqui"
OPENROUTER_API_KEY="sua_chave_do_openrouter_aqui"
```

---

### **Configuração do Banco de Dados**

Esta API utiliza o Prisma para gerenciamento do PostgreSQL.

#### **1. Executar Migrations**
Para aplicar a estrutura do banco de dados relacional no seu banco local/remoto:
```bash
pnpm prisma migrate dev
```

#### **2. Popular o Banco de Dados (Seed)**
Para preencher o banco com dados simulados de clientes, projetos e despesas para teste local:
```bash
pnpm prisma db seed
```

#### **3. Prisma Studio**
Para abrir o painel visual do Prisma e inspecionar/editar registros do banco através de uma interface web:
```bash
pnpm prisma studio
```

---

### **Execução da Aplicação**

#### **Instalar dependências**
```bash
pnpm install
```

#### **Gerar primeiro código de convite**
Como a plataforma exige convites para cadastro de usuários (segurança para ambientes fechados), você deve gerar um código de convite inicial usando o script utilitário:
```bash
pnpm generate:invite
```
*Copie o código gerado no console e use-o no fluxo de registro no frontend.*

#### **Modo Desenvolvimento**
Roda a API com atualização automática a cada mudança de código:
```bash
pnpm run start:dev
```

#### **Modo Produção**
Compila o código TypeScript em JavaScript puro (`dist/`) e inicia o servidor compilado:
```bash
pnpm run build
pnpm run start:prod
```

---

### **Endpoints e Módulos Principais**

A API é dividida nos seguintes domínios lógicos:

*   `/auth`: Cadastro, Login, Logout e Refresh Token via cookies seguros.
*   `/clients`: CRUD do CRM (clientes, leads, status de contato).
*   `/projects`: Criação e monitoramento de projetos (Developer / Marketing).
*   `/tasks`: Gerenciamento de quadros de tarefas e checklists de subtarefas.
*   `/payments`: Lançamento e quitação de parcelas de projetos.
*   `/expenses`: Registro de despesas financeiras operacionais.
*   `/time-entries`: Logs de horas trabalhadas via cronômetro de tarefas.
*   `/events`: Agenda de reuniões e prazos de entregas.
*   `/services`: Serviços pontuais que não exigem o escopo de um projeto completo.
*   `/dashboard`: Consolidação de métricas financeiras e de progresso operacional.
*   `/ai`: Assistente inteligente conversacional.

---

### **Integração de Inteligência Artificial**

O módulo `/ai` interage com modelos de linguagem natural e está preparado para:
1. **Google Gemini**: Conecta-se diretamente ao modelo `gemini-2.5-flash` através do SDK `@google/genai`.
2. **OpenRouter**: Realiza requisições HTTPS integrando modelos com raciocínio profundo (*reasoning*).

Ambos os provedores utilizam o padrão de chat estruturado JSON para extrair metadados e retornar sugestões de cronogramas e tarefas prontas para inserção no banco de dados do usuário.

---

### **Documentação da API (Swagger)**

A API conta com documentação interativa integrada. Ao rodar o servidor localmente, acesse:
*   [http://localhost:3000/api/docs](http://localhost:3000/api/docs) *(ou o endereço configurado na sua porta)*
