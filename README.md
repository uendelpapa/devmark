# **Devmark** 🚀
*Plataforma de Gestão Inteligente para Freelancers, Desenvolvedores e Agências*

O **Devmark** é um ecossistema completo de gestão concebido especificamente para profissionais independentes (freelancers), estúdios de design, profissionais de marketing e desenvolvedores de software. O projeto resolve a fragmentação de ferramentas (como Trello para tarefas, Excel para finanças, CRM separado para clientes e Toggl para horas) unificando toda a jornada do profissional em uma única plataforma integrada, robusta e altamente intuitiva.

Com o Devmark, o profissional consegue desde nutrir a relação inicial com um Lead, estimar e planejar o projeto de forma colaborativa com Inteligência Artificial, controlar o andamento das tarefas, registrar o tempo trabalhado via cronômetro, gerenciar o faturamento por parcelas até monitorar as despesas operacionais da sua atividade.

---

### **Sumário**
1. [Principais Funcionalidades](#principais-funcionalidades)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Stack Tecnológica](#stack-tecnológica)
4. [Guia de Configuração e Instalação](#guia-de-configuração-e-instalação)
5. [Estrutura de Diretórios](#estrutura-de-diretórios)

---

### **Principais Funcionalidades**

#### **1. CRM & Gestão de Clientes**
*   **Funil de Relacionamento**: Classificação granular de clientes em status como `LEAD`, `NEGOTIATING` (Em Negociação), `ACTIVE` (Ativo), `INACTIVE` (Inativo) e `LOST` (Perdido).
*   **Preferências Customizadas**: Definição do canal de comunicação favorito do cliente (WhatsApp, E-mail, Telefone, Reuniões) e método de pagamento preferencial (PIX, Boleto/Transferência, Cartão de Crédito, Dinheiro).
*   **Histórico Consolidado**: Visualização centralizada de todos os projetos e faturamentos vinculados a cada cliente diretamente em seu perfil.

#### **2. Gestão Operacional de Projetos**
*   **Categorização por Área**: Divisão clara entre projetos de `DEVELOPER` (Desenvolvimento) e `MARKETING` (Marketing/Design).
*   **Metadados Ricos**: Definição de especialidades (ex: Frontend, Backend, SEO), prioridades (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), e estimativas de prazos e horas.
*   **Estrutura de Tarefas**: Divisão dos projetos em tarefas com controle de status (`PENDING`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `CANCELED`), priorização interna e checklist de subtarefas.
*   **Anexos e Recursos (Assets)**: Upload e gerenciamento de arquivos (imagens, PDFs, documentos, planilhas) associados a projetos ou tarefas individuais.

#### **3. Assistente de Inteligência Artificial (Gemini & OpenRouter)**
*   **Planejador Conversacional (Chat)**: Criação interativa de projetos por meio de conversação em linguagem natural com a IA.
*   **Extração Inteligente de Parâmetros**: A IA detecta dados importantes ao longo da conversa (nome do projeto, valor, datas de início e entrega, área, prioridade).
*   **Mapeamento de Clientes**: Reconhecimento automático dos clientes cadastrados no banco a partir de menções textuais na conversa.
*   **Geração Automatizada de Escopo**: Ao concluir a coleta de dados, o assistente ativa a criação do projeto e propõe uma quebra lógica de 3 a 5 tarefas estruturadas com horas estimadas e descrições técnicas.
*   **Múltiplos Adaptadores**: Suporta chamadas diretas ao **Google Gemini** (usando `@google/genai` com o modelo `gemini-2.5-flash`) ou via **OpenRouter** (com suporte a modelos de reasoning de raciocínio profundo).

#### **4. Controle Financeiro Completo**
*   **Faturamento (Pagamentos)**: Fluxo de recebíveis vinculado a projetos com emissão de parcelas contendo datas de vencimento, datas de pagamento, formas de pagamento e status (`PENDING`, `OVERDUE`, `PAID`, `CANCELED`).
*   **Fluxo de Despesas**: Lançamento de custos operacionais e operacionais de projetos ou tarefas com categorizações detalhadas (`AI`, `SOFTWARE`, `DOMAIN`, `HOSTING`, `DESIGN`, `ADS`, `FREELANCER`, `OTHER`).
*   **Indicadores de Saúde Financeira**: Dashboard centralizado que consolida o faturamento total recebido, faturamento pendente, despesas do período e taxas de crescimento com indicadores direcionais comparativos em relação ao período anterior.

#### **5. Registro de Horas (Time Tracking)**
*   **Widget de Cronômetro (Timer)**: Início, pausa e parada de tempo trabalhado em tempo real a partir de qualquer visualização no dashboard ou na tela de tarefas.
*   **Timesheet Integrado**: Logs automáticos contendo a descrição das atividades realizadas, associados diretamente a uma tarefa e projeto específico.
*   **Relação Real vs. Estimado**: Comparativos visuais entre as estimativas operacionais de esforço e as horas efetivamente despendidas.

#### **6. Calendário e Agendamentos**
*   Visualização centralizada de datas importantes, prazos de entrega e reuniões ou eventos agendados pelo usuário.

---

### **Arquitetura do Sistema**

O Devmark adota uma arquitetura limpa e desacoplada, operando em modelo monorepo dividido entre `/api` (Backend) e `/frontend` (Interface).

```mermaid
graph TD
    Client[Browser / Frontend React] -->|Requisições HTTP / Cookies| API[NestJS API / Backend]
    API -->|Prisma Client| DB[(PostgreSQL Database)]
    API -->|Google GenAI SDK| Gemini[Gemini API]
    API -->|Fetch API / HTTPS| OpenRouter[OpenRouter API]
```

*   **Camada de Apresentação (Frontend)**: Uma Single Page Application (SPA) construída sob design responsivo, com temas premium baseados em tokens CSS HSL para garantir transições fluidas e alto impacto estético.
*   **Camada de Aplicação (Backend)**: API RESTful altamente escalável estruturada de forma modular (NestJS), garantindo isolamento de regras de negócios por recurso.
*   **Camada de Dados**: Banco de dados relacional robusto estruturado por migrations Prisma e consultas tipadas.

---

### **Stack Tecnológica**

#### **Frontend**
*   **React 18** + **TypeScript**
*   **Vite**: Bundler rápido para desenvolvimento e compilação em produção.
*   **TanStack Router**: Roteamento baseado em arquivos tipado estaticamente para maior segurança no fluxo do app.
*   **TanStack Query (React Query)**: Cache, sincronização de estado do servidor, invalidação e revalidação em segundo plano.
*   **HeroUI** (antigo NextUI) & **Tailwind CSS**: Frameworks de estilo para componentes responsivos e customizações visuais.
*   **Gravity UI Icons**: Conjunto de ícones premium.

#### **Backend (API)**
*   **NestJS 11**: Framework opinativo para aplicações eficientes e robustas no lado do servidor.
*   **Prisma ORM**: Modelagem declarativa e geração segura de tipos do banco.
*   **Passport.js & JWT**: Mecanismo de autenticação seguro que envia tokens via cookies `HttpOnly` seguros para mitigar ataques XSS.
*   **class-validator & class-transformer**: Validação de payloads de entrada nos endpoints (DTOs).
*   **Google GenAI SDK**: Integração oficial com a inteligência artificial generativa do Google Gemini.

#### **Banco de Dados**
*   **PostgreSQL**: Engine de banco de dados relacional de missão crítica.

---

### **Guia de Configuração e Instalação**

#### **Pré-requisitos**
*   **Node.js** (v18 ou superior)
*   **pnpm** (gerenciador de pacotes preferencial)
*   Instância de banco de dados **PostgreSQL** ativa

---

#### **1. Configurando o Backend (API)**

1. Acesse a pasta da API:
   ```bash
   cd api
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Crie um arquivo `.env` na raiz de `/api` configurando as variáveis:
   ```env
   PORT=3000
   
   # Configurações do Banco de Dados
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/devmark?schema=public"
   DIRECT_URL="postgresql://usuario:senha@localhost:5432/devmark?schema=public"

   # Autenticação JWT
   JWT_SECRET="sua_chave_secreta_super_segura"
   JWT_EXPIRES_IN="7d"

   # Integrações de Inteligência Artificial
   GEMINI_API_KEY="sua_chave_api_do_google_gemini"
   OPENROUTER_API_KEY="sua_chave_api_do_openrouter"
   ```

4. Execute as migrations do Prisma para estruturar o PostgreSQL:
   ```bash
   pnpm prisma migrate dev
   ```

5. Opcional: Popule o banco com dados demo (Seeding):
   ```bash
   pnpm prisma db seed
   ```

6. Gere o primeiro código de convite para criar sua conta de acesso no frontend:
   ```bash
   pnpm generate:invite
   ```
   *Guarde o código impresso no console para utilizar na tela de registro.*

7. Inicie a API em modo de desenvolvimento:
   ```bash
   pnpm run start:dev
   ```
   *O backend estará rodando em: `http://localhost:3000`*

---

#### **2. Configurando o Frontend**

1. Navegue para o diretório do frontend:
   ```bash
   cd ../frontend
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Crie o arquivo de variáveis `.env` ou `.env.local` contendo:
   ```env
   VITE_API_URL="http://localhost:3000"
   ```

4. Execute o servidor do Vite para desenvolvimento local:
   ```bash
   pnpm run dev
   ```
   *O painel estará disponível para acesso no navegador em: `http://localhost:5173`*

---

### **Estrutura de Diretórios**
```text
devmark/
├── api/                     # Backend da aplicação (NestJS)
│   ├── prisma/              # Modelagem de dados, seeds e migrations Prisma
│   ├── scripts/             # Scripts utilitários (como gerador de invites)
│   └── src/                 # Código do servidor NestJS
│       ├── ai/              # Módulo de integrações de IA
│       ├── auth/            # Segurança, JWT e logins
│       ├── clients/         # Lógica do CRM de Clientes
│       ├── projects/        # Lógica de Projetos
│       ├── tasks/           # Lógica das Tarefas e checklists
│       ├── payments/        # Recebíveis e fluxo de caixas
│       ├── expenses/        # Despesas de projetos e tarefas
│       └── time-entries/    # Timesheets e cronômetro
│
├── frontend/                # Frontend da aplicação (React / Vite)
│   └── src/                 # Código principal do SPA
│       ├── components/      # UI, layouts, gráficos e formulários
│       ├── routes/          # Páginas sob TanStack Router
│       ├── services/        # Chamadas de API HTTP
│       ├── hooks/           # Regras globais, queries e mutações
│       └── styles.css       # Design System de CSS e variáveis de cor
```
