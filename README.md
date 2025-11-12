## 🙋‍♂️ Autor

<div align="center">
  <img src="https://avatars.githubusercontent.com/ninomiquelino" width="100" height="100" style="border-radius: 50%">
  <br>
  <strong>Onivaldo Miquelino</strong>
  <br>
  <a href="https://github.com/ninomiquelino">@ninomiquelino</a>
</div>

---

# 🔄 SyncFlow - Plataforma de Integração ERP/CRM

![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-green)

Uma plataforma frontend moderna desenvolvida em Angular para integração e sincronização de dados entre sistemas ERP e CRM como RD Station, Bling, Pipedrive, Omie e outros.

## 🚀 Recursos Principais

### 🔐 Autenticação e Segurança
- **Autenticação OAuth2** com múltiplos provedores
- **Tokens JWT** com refresh automático
- **Guards de rota** para proteção de páginas
- **Interceptores HTTP** para autenticação automática

### 📊 Dashboard Inteligente
- **Visão geral em tempo real** do status das integrações
- **Métricas de sincronização** (clientes, pedidos, notas fiscais)
- **Cartões de integração** com status visual
- **Atividade recente** com timeline interativa

### 🔄 Gerenciamento de Integrações
- **Serviço REST reutilizável** para múltiplas APIs
- **Suporte a ERP/CRM**: RD Station, Bling, Pipedrive, Omie, Tiny
- **Sincronização manual/automática**
- **Configuração flexível** de endpoints

### 📋 Logs e Monitoramento
- **Logs detalhados** de todas as operações
- **Filtros avançados** por tipo, status e integração
- **Exportação em CSV** para análise externa
- **Notificações em tempo real**

### 📱 Design Responsivo
- **Interface mobile-first**
- **Otimizado para desktop** e dispositivos móveis
- **Componentes acessíveis**
- **Tema escuro/claro** (planejado)

## 🛠️ Tecnologias Utilizadas

- **Frontend Framework**: Angular 17
- **Linguagem**: TypeScript
- **UI Components**: Bootstrap 5 + CSS Custom
- **Ícones**: Font Awesome 6
- **Gerenciamento de Estado**: RxJS
- **HTTP Client**: Angular HttpClient
- **Roteamento**: Angular Router
- **Build Tool**: Angular CLI

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Angular CLI 17+

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/NinoMiquelino/erp-crm-integration-platform-angularjs.git
cd erp-crm-integration-platform-angularjs
```

1. Instale as dependências

```bash
npm install
```

1. Configure as variáveis de ambiente

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Edite o arquivo environment.ts com suas configurações:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://sua-api-backend.com',
  oauth: {
    rdStation: {
      clientId: 'seu-client-id',
      redirectUri: 'http://localhost:4200/oauth/callback'
    },
    bling: {
      clientId: 'seu-client-id',
      redirectUri: 'http://localhost:4200/oauth/callback'
    }
  }
};
```

1. Execute a aplicação

```bash
ng serve
```

1. Acesse no navegador

```
http://localhost:4200
```

🏗️ Estrutura do Projeto

```
erp-crm-integration-platform-angularjs/
├── app/
│   ├── components/          # Componentes Angular
│   │   ├── auth/           # Autenticação e login
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── logs/           # Visualização de logs
│   │   └── shared/         # Componentes compartilhados
│   ├── services/           # Serviços Angular
│   │   ├── auth.service.ts # Autenticação OAuth2
│   │   └── integration.service.ts # Serviço de integração
│   ├── guards/             # Guards de rota
│   ├── interceptors/       # Interceptores HTTP
│   └── models/             # Interfaces TypeScript
├── assets/                 # Recursos estáticos
└── environments/           # Configurações por ambiente
```

🔧 Configuração de Integrações

Adicionando Nova Integração

1. Registre no Integration Service

```typescript
this.integrationService.registerIntegration('novoSistema', {
  baseUrl: 'https://api.novosistema.com',
  authType: 'oauth2',
  authConfig: {
    tokenKey: 'novosistema_token'
  }
});
```

1. Configure OAuth2 (se necessário)

```typescript
// No Auth Service
private getOAuthUrl(provider: string): string {
  return {
    // ... provedores existentes
    'novoSistema': 'https://api.novosistema.com/oauth/authorize'
  }[provider];
}
```

Exemplo de Uso do Serviço

```typescript
// Buscar clientes do RD Station
this.integrationService.get('rdstation', '/contacts')
  .subscribe({
    next: (response) => {
      console.log('Clientes:', response.data);
    },
    error: (error) => {
      console.error('Erro:', error);
    }
  });

// Criar pedido no Bling
this.integrationService.post('bling', '/pedidos', pedidoData)
  .subscribe(response => {
    // Tratar resposta
  });
```

🎨 Personalização

Cores e Tema

Modifique as variáveis CSS em styles.scss:

```scss
:root {
  --primary-color: #3498db;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
}
```

Adicionando Novo Tema

Crie um novo arquivo SCSS e importe no angular.json:

```json
"styles": [
  "src/styles.scss",
  "src/themes/corporate.scss"
]
```

📱 Layout Responsivo

Breakpoints

· Mobile: < 768px<br>
· Tablet: 768px - 1023px<br>
· Desktop: ≥ 1024px

Componentes Adaptáveis

· Dashboard: Grid que se ajusta de 1 a 4 colunas<br>
· Cartões de Integração: Layout vertical em mobile<br>
· Tabelas: Scroll horizontal em dispositivos pequenos<br>
· Formulários: Campos empilhados verticalmente

🚀 Scripts Disponíveis

```bash
# Desenvolvimento
ng serve          # Servidor de desenvolvimento
ng build          # Build de produção
ng test           # Executar testes unitários
ng e2e            # Executar testes end-to-end

# Análise e Otimização
ng lint           # Análise estática do código
ng analyze        # Analisar bundle (webpack-bundle-analyzer)

# Geradores
ng generate component components/nome-componente
ng generate service services/nome-servico
```

🔒 Variáveis de Ambiente

Variável Descrição Exemplo
apiUrl URL da API backend https://api.syncflow.com
production Modo produção false
oauth.*.clientId Client ID OAuth2 client_123456
oauth.*.redirectUri URI de redirecionamento http://localhost:4200/callback

Padrões de Código

· Siga o Angular Style Guide<br>
· Use commits convencionais<br>
· Mantenha cobertura de testes acima de 80%

🔄 Roadmap

· Fase 1: Suporte a mais ERPs (TOTVS, SAP)<br>
· Fase 2: Sincronização em tempo real (WebSockets)<br>
· Fase 3: Tema escuro<br>
· Fase 4: Plugin system para integrações customizadas<br>
· Fase 5: Relatórios avançados e analytics

---

Desenvolvido com ❤️ para simplificar integrações empresariais

---

## 🤝 Contribuições
Contribuições são sempre bem-vindas!  
Sinta-se à vontade para abrir uma [*issue*](https://github.com/NinoMiquelino/erp-crm-integration-platform-angularjs/issues) com sugestões ou enviar um [*pull request*](https://github.com/NinoMiquelino/erp-crm-integration-platform-angularjs/pulls) com melhorias.

---

## 💬 Contato
📧 [Entre em contato pelo LinkedIn](https://www.linkedin.com/in/onivaldomiquelino/)  
💻 Desenvolvido por **Onivaldo Miquelino**

---
