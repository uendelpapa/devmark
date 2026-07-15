# **Devmark - Frontend** 🎨
*Interface do Usuário da Plataforma Devmark*

Este é o frontend da plataforma **Devmark**, uma aplicação web responsiva do tipo SPA (Single Page Application) construída em React, TypeScript e Vite. Ela fornece uma interface moderna e intuitiva para o gerenciamento de clientes, projetos, tarefas, finanças e controle de horas (*time tracking*).

---

### **Sumário**
1. [Stack Tecnológica](#stack-tecnológica)
2. [Configurações e Requisitos](#configurações-e-requisitos)
3. [Scripts Disponíveis](#scripts-disponíveis)
4. [Estrutura de Diretórios](#estrutura-de-diretórios)
5. [Rotas e Roteamento](#rotas-e-roteamento)

---

### **Stack Tecnológica**

O frontend utiliza ferramentas modernas que garantem alta performance, tipagem estática ponta a ponta e carregamento veloz:

*   **React 18** & **TypeScript**: Construção de componentes dinâmicos e tipagem segura.
*   **Vite**: Build tool extremamente rápido para o fluxo de desenvolvimento local e compilação de produção.
*   **TanStack Router**: Roteamento baseado em arquivos com segurança de tipos em tempo de compilação.
*   **TanStack Query (React Query)**: Gerenciamento de estado do servidor, cacheamento automático, revalidação em background e sincronização otimista.
*   **HeroUI** (antigo NextUI) & **Tailwind CSS**: Estilização baseada em utilitários e componentes estilizados e acessíveis.
*   **Gravity UI Icons**: Conjunto de ícones vetoriais.

---

### **Configurações e Requisitos**

#### **Pré-requisitos**
*   **Node.js** (v18 ou superior)
*   **pnpm** (gerenciador de pacotes)

#### **Variáveis de Ambiente**
Crie um arquivo `.env` ou `.env.local` na raiz de `/frontend` para apontar o endereço da API backend:
```env
VITE_API_URL="http://localhost:3000"
```

---

### **Scripts Disponíveis**

Na pasta `/frontend`, você pode rodar os seguintes comandos:

#### **Instalar dependências**
```bash
pnpm install
```

#### **Ambiente de Desenvolvimento**
Inicia o servidor de desenvolvimento do Vite com hot reload:
```bash
pnpm run dev
```
*Acesse no navegador através do endereço exibido no console (por padrão `http://localhost:5173`).*

#### **Compilar para Produção**
Gera o bundle otimizado na pasta `dist/`:
```bash
pnpm run build
```

#### **Verificação e Linter**
Roda testes de tipo, linter e formatação:
```bash
pnpm lint     # Executa análise estática com ESLint
pnpm format   # Formata os arquivos utilizando Prettier
```

#### **Executar Testes**
Executa a suíte de testes com Vitest:
```bash
pnpm run test
```

---

### **Estrutura de Diretórios**

A estrutura interna de código foi projetada para separação limpa de conceitos:

```text
frontend/
├── public/                  # Arquivos estáticos (ícones, logos, etc.)
├── src/
│   ├── components/          # Componentes visuais reutilizáveis
│   │   ├── ui/              # Componentes de base (Button, Select, Input)
│   │   ├── layout/          # Estruturas de layout (Header, Sidebar)
│   │   ├── finance/         # Componentes específicos de finanças e parcelas
│   │   └── projects/        # Visualizações de projetos e tarefas
│   │
│   ├── routes/              # Rotas e páginas gerenciadas pelo TanStack Router
│   │   ├── _authenticated/  # Rotas protegidas (Dashboard, Clientes, Projetos, etc.)
│   │   ├── login.tsx        # Página de autenticação
│   │   └── registrar.tsx    # Página de cadastro com código de convite
│   │
│   ├── services/            # Integração HTTP com a API (Axios / Fetch)
│   ├── hooks/               # Custom Hooks e queries do TanStack Query
│   ├── styles.css           # Estilos globais e tokens de cores CSS HSL
│   ├── router.tsx           # Configuração de inicialização do Router
│   └── routeTree.gen.ts     # Árvore de rotas gerada automaticamente pelo TanStack Router
```

---

### **Rotas e Roteamento**

Esta aplicação utiliza roteamento baseado em arquivos do **TanStack Router**. 
Qualquer arquivo criado no diretório `src/routes` gera automaticamente uma rota correspondente.

*   O arquivo `src/routes/routeTree.gen.ts` é gerado dinamicamente durante a execução de `pnpm dev`. **Não edite este arquivo manualmente**.
*   Rotas sob a pasta `_authenticated/` exigem autenticação do usuário. A validação de tokens é tratada no carregamento da rota raiz.
