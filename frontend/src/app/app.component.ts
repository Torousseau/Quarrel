// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  template: `<h1>{{ message }}</h1>`,
})
export class AppComponent implements OnInit {
  title(title: any) {
      throw new Error('Method not implemented.');
  }
  message = 'Loading...';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.pingBackend().subscribe({
      next: (msg) => this.message = msg,
      error: (err) => this.message = 'Erreur de connexion au backend',
    });
  }
}
