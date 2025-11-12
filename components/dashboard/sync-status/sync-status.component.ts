// components/dashboard/sync-status/sync-status.component.ts
import { Component, OnInit } from '@angular/core';

export interface SyncActivity {
  id: string;
  integration: string;
  type: 'client' | 'order' | 'invoice';
  action: 'created' | 'updated' | 'deleted' | 'synced';
  status: 'success' | 'error' | 'pending';
  timestamp: Date;
  message?: string;
}

@Component({
  selector: 'app-sync-status',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.scss']
})
export class SyncStatusComponent implements OnInit {
  activities: SyncActivity[] = [];
  filteredActivities: SyncActivity[] = [];
  filters = {
    integration: 'all',
    type: 'all',
    status: 'all'
  };

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    // Simulação de atividades
    this.activities = [
      {
        id: '1',
        integration: 'RD Station',
        type: 'client',
        action: 'created',
        status: 'success',
        timestamp: new Date(),
        message: 'Cliente João Silva criado com sucesso'
      },
      {
        id: '2',
        integration: 'Bling',
        type: 'order',
        action: 'synced',
        status: 'success',
        timestamp: new Date(Date.now() - 300000),
        message: '15 pedidos sincronizados'
      },
      {
        id: '3',
        integration: 'Pipedrive',
        type: 'client',
        action: 'updated',
        status: 'error',
        timestamp: new Date(Date.now() - 600000),
        message: 'Erro ao atualizar cliente: Timeout'
      },
      {
        id: '4',
        integration: 'RD Station',
        type: 'invoice',
        action: 'created',
        status: 'pending',
        timestamp: new Date(Date.now() - 900000),
        message: 'Aguardando processamento'
      }
    ];
    this.filteredActivities = [...this.activities];
  }

  applyFilters(): void {
    this.filteredActivities = this.activities.filter(activity => {
      const integrationMatch = this.filters.integration === 'all' || 
                              activity.integration === this.filters.integration;
      const typeMatch = this.filters.type === 'all' || 
                       activity.type === this.filters.type;
      const statusMatch = this.filters.status === 'all' || 
                         activity.status === this.filters.status;
      
      return integrationMatch && typeMatch && statusMatch;
    });
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'success': 'fas fa-check-circle text-success',
      'error': 'fas fa-exclamation-circle text-danger',
      'pending': 'fas fa-clock text-warning'
    };
    return icons[status] || 'fas fa-info-circle';
  }

  getActionColor(action: string): string {
    const colors: { [key: string]: string } = {
      'created': 'success',
      'updated': 'primary',
      'deleted': 'danger',
      'synced': 'info'
    };
    return colors[action] || 'secondary';
  }
}