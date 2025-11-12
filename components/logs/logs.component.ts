// components/logs/logs.component.ts
import { Component, OnInit } from '@angular/core';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  integration: string;
  message: string;
  details?: any;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logs: LogEntry[] = [];
  filteredLogs: LogEntry[] = [];
  searchTerm = '';
  levelFilter = 'all';
  integrationFilter = 'all';
  pageSize = 20;
  currentPage = 1;
  totalPages = 1;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    // Simulação de logs
    this.logs = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      timestamp: new Date(Date.now() - i * 60000),
      level: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)] as 'info' | 'warning' | 'error',
      integration: ['RD Station', 'Bling', 'Pipedrive', 'Omie'][Math.floor(Math.random() * 4)],
      message: `Log entry ${i + 1}: ${['Client sync completed', 'Order update failed', 'Invoice created', 'API timeout'][Math.floor(Math.random() * 4)]}`,
      details: i % 5 === 0 ? { error: 'Timeout', retryCount: 3 } : undefined
    }));

    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.logs;

    // Aplicar filtro de nível
    if (this.levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === this.levelFilter);
    }

    // Aplicar filtro de integração
    if (this.integrationFilter !== 'all') {
      filtered = filtered.filter(log => log.integration === this.integrationFilter);
    }

    // Aplicar busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) ||
        log.integration.toLowerCase().includes(term)
      );
    }

    this.filteredLogs = filtered;
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize);
    this.currentPage = 1;
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      'info': 'primary',
      'warning': 'warning',
      'error': 'danger'
    };
    return colors[level] || 'secondary';
  }

  getLevelIcon(level: string): string {
    const icons: { [key: string]: string } = {
      'info': 'fas fa-info-circle',
      'warning': 'fas fa-exclamation-triangle',
      'error': 'fas fa-exclamation-circle'
    };
    return icons[level] || 'fas fa-circle';
  }

  exportLogs(): void {
    const csvContent = this.convertToCSV(this.filteredLogs);
    this.downloadCSV(csvContent, 'integration-logs.csv');
  }

  private convertToCSV(logs: LogEntry[]): string {
    const headers = ['Timestamp', 'Level', 'Integration', 'Message'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.level,
      log.integration,
      `"${log.message.replace(/"/g, '""')}"`
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}