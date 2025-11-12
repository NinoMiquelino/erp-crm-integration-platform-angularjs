// components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { IntegrationService } from '../../services/integration.service';
import { AuthService } from '../../services/auth.service';

export interface Integration {
  id: string;
  name: string;
  type: 'erp' | 'crm';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: Date | null;
  stats: {
    clients: number;
    orders: number;
    invoices: number;
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  integrations: Integration[] = [];
  loading = true;
  user: any;

  constructor(
    private integrationService: IntegrationService,
    private authService: AuthService
  ) {
    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadIntegrations();
    this.setupDefaultIntegrations();
  }

  loadIntegrations(): void {
    // Simulando carregamento de integrações
    setTimeout(() => {
      this.integrations = [
        {
          id: '1',
          name: 'RD Station',
          type: 'crm',
          status: 'connected',
          lastSync: new Date(),
          stats: { clients: 1250, orders: 342, invoices: 298 }
        },
        {
          id: '2',
          name: 'Bling',
          type: 'erp',
          status: 'syncing',
          lastSync: new Date(Date.now() - 3600000),
          stats: { clients: 890, orders: 156, invoices: 143 }
        },
        {
          id: '3',
          name: 'Pipedrive',
          type: 'crm',
          status: 'error',
          lastSync: new Date(Date.now() - 86400000),
          stats: { clients: 0, orders: 0, invoices: 0 }
        },
        {
          id: '4',
          name: 'Omie',
          type: 'erp',
          status: 'disconnected',
          lastSync: null,
          stats: { clients: 0, orders: 0, invoices: 0 }
        }
      ];
      this.loading = false;
    }, 1000);
  }

  setupDefaultIntegrations(): void {
    // Configuração padrão para integrações comuns
    const integrationsConfig = [
      {
        name: 'rdstation',
        config: {
          baseUrl: 'https://api.rd.services',
          authType: 'oauth2' as const,
          authConfig: {
            tokenKey: 'rdstation_token'
          }
        }
      },
      {
        name: 'bling',
        config: {
          baseUrl: 'https://www.bling.com.br/Api/v3',
          authType: 'oauth2' as const,
          authConfig: {
            tokenKey: 'bling_token'
          }
        }
      }
    ];

    integrationsConfig.forEach(integration => {
      this.integrationService.registerIntegration(integration.name, integration.config);
    });
  }

  connectIntegration(integration: Integration): void {
    integration.status = 'syncing';
    
    // Simulação de conexão
    setTimeout(() => {
      integration.status = 'connected';
      integration.lastSync = new Date();
      integration.stats = { clients: 500, orders: 120, invoices: 95 };
    }, 2000);
  }

  syncIntegration(integration: Integration): void {
    integration.status = 'syncing';
    
    // Simulação de sincronização
    setTimeout(() => {
      integration.status = 'connected';
      integration.lastSync = new Date();
      integration.stats.clients += Math.floor(Math.random() * 10);
      integration.stats.orders += Math.floor(Math.random() * 5);
      integration.stats.invoices += Math.floor(Math.random() * 3);
    }, 3000);
  }

  disconnectIntegration(integration: Integration): void {
    integration.status = 'disconnected';
    integration.lastSync = null;
    integration.stats = { clients: 0, orders: 0, invoices: 0 };
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'connected': 'success',
      'disconnected': 'secondary',
      'syncing': 'warning',
      'error': 'danger'
    };
    return colors[status] || 'secondary';
  }
}