import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="lessons-container">
      <div class="header">
        <h2>📖 Lessons Management</h2>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add New Lesson
        </button>
      </div>

      <div class="content">
        <mat-card>
          <mat-card-content>
            <p>Lessons management functionality will be implemented here.</p>
            <p>This will include:</p>
            <ul>
              <li>Create new lessons</li>
              <li>Edit existing lessons</li>
              <li>Assign lessons to levels</li>
              <li>Manage lesson content</li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .lessons-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h2 {
      margin: 0;
      color: #333;
    }

    .content {
      margin-top: 20px;
    }

    .content ul {
      margin: 16px 0;
      padding-left: 20px;
    }

    .content li {
      margin-bottom: 8px;
    }
  `]
})
export class LessonsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
