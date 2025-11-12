// components/dashboard/integration-card/integration-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Integration } from '../dashboard.component';

@Component({
  selector: 'app-integration-card',
  templateUrl: './integration-card.component.html',
  styleUrls: ['./integration-card.component.scss']
})
export class IntegrationCardComponent {
  @Input() integration!: Integration;
  @Output() connect = new EventEmitter<Integration>();
  @Output() sync = new EventEmitter<Integration>();
  @Output() disconnect = new EventEmitter<Integration>();

  getIntegrationIcon(name: string): string {
    const icons: { [key: string]: string } = {
      'RD Station': 'fas fa-chart-line',
      'Bling': 'fas fa-boxes',
      'Pipedrive': 'fas fa-funnel-dollar',
      'Omie': 'fas fa-building',
      'Tiny': 'fas fa-store'
    };
    return icons[name] || 'fas fa-plug';
  }

  onConnect(): void {
    this.connect.emit(this.integration);
  }

  onSync(): void {
    this.sync.emit(this.integration);
  }

  onDisconnect(): void {
    this.disconnect.emit(this.integration);
  }
}