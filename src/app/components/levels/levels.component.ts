import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

interface Level {
  id: number;
  title: string;
  description: string;
  sequenceOrder: number;
  learningStage: 'letters' | 'words' | 'sentences';
  isActive: boolean;
}

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule
  ],
  template: `
    <div class="levels-container">
      <div class="header">
        <h2>📚 Levels Management</h2>
        <button mat-raised-button color="primary" (click)="openAddLevelDialog()">
          <mat-icon>add</mat-icon>
          Add New Level
        </button>
      </div>

      <div class="content">
        <mat-card>
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="levels" class="levels-table">
                <ng-container matColumnDef="sequenceOrder">
                  <th mat-header-cell *matHeaderCellDef>Order</th>
                  <td mat-cell *matCellDef="let level">{{ level.sequenceOrder }}</td>
                </ng-container>

                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Title</th>
                  <td mat-cell *matCellDef="let level">{{ level.title }}</td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let level">{{ level.description }}</td>
                </ng-container>

                <ng-container matColumnDef="learningStage">
                  <th mat-header-cell *matHeaderCellDef>Stage</th>
                  <td mat-cell *matCellDef="let level">
                    <span class="stage-badge" [class]="'stage-' + level.learningStage">
                      {{ level.learningStage | titlecase }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let level">
                    <span class="status-badge" [class]="level.isActive ? 'active' : 'inactive'">
                      {{ level.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let level">
                    <button mat-icon-button color="primary" (click)="editLevel(level)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteLevel(level)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <!-- Add/Edit Level Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Level' : 'Add New Level' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form class="level-form" (ngSubmit)="saveLevel()">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput [(ngModel)]="currentLevel.title" name="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="currentLevel.description" name="description" rows="3"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Sequence Order</mat-label>
            <input matInput type="number" [(ngModel)]="currentLevel.sequenceOrder" name="sequenceOrder" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Learning Stage</mat-label>
            <mat-select [(ngModel)]="currentLevel.learningStage" name="learningStage" required>
              <mat-option value="letters">Letters</mat-option>
              <mat-option value="words">Words</mat-option>
              <mat-option value="sentences">Sentences</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeDialog()">Cancel</button>
            <button mat-raised-button color="primary" type="submit">
              {{ isEditing ? 'Update' : 'Add' }} Level
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .levels-container {
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

    .table-container {
      overflow-x: auto;
    }

    .levels-table {
      width: 100%;
    }

    .stage-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .stage-letters {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .stage-words {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .stage-sentences {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .status-badge.inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 8px;
      padding: 0;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h3 {
      margin: 0;
      color: #333;
    }

    .level-form {
      padding: 20px;
    }

    .level-form mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
  `]
})
export class LevelsComponent implements OnInit {
  levels: Level[] = [];
  displayedColumns: string[] = ['sequenceOrder', 'title', 'description', 'learningStage', 'isActive', 'actions'];
  showDialog = false;
  isEditing = false;
  currentLevel: Level = {
    id: 0,
    title: '',
    description: '',
    sequenceOrder: 1,
    learningStage: 'letters',
    isActive: true
  };

  constructor() {}

  ngOnInit() {
    this.loadLevels();
  }

  loadLevels() {
    // Mock data - replace with actual API call
    this.levels = [
      {
        id: 1,
        title: 'Basic Letters',
        description: 'Learn basic Tamil letters',
        sequenceOrder: 1,
        learningStage: 'letters',
        isActive: true
      },
      {
        id: 2,
        title: 'Simple Words',
        description: 'Form simple words from letters',
        sequenceOrder: 2,
        learningStage: 'words',
        isActive: true
      },
      {
        id: 3,
        title: 'Basic Sentences',
        description: 'Create basic sentences',
        sequenceOrder: 3,
        learningStage: 'sentences',
        isActive: false
      }
    ];
  }

  openAddLevelDialog() {
    this.isEditing = false;
    this.currentLevel = {
      id: 0,
      title: '',
      description: '',
      sequenceOrder: this.levels.length + 1,
      learningStage: 'letters',
      isActive: true
    };
    this.showDialog = true;
  }

  editLevel(level: Level) {
    this.isEditing = true;
    this.currentLevel = { ...level };
    this.showDialog = true;
  }

  deleteLevel(level: Level) {
    if (confirm(`Are you sure you want to delete "${level.title}"?`)) {
      this.levels = this.levels.filter(l => l.id !== level.id);
    }
  }

  saveLevel() {
    if (this.isEditing) {
      const index = this.levels.findIndex(l => l.id === this.currentLevel.id);
      if (index !== -1) {
        this.levels[index] = { ...this.currentLevel };
      }
    } else {
      this.currentLevel.id = Math.max(...this.levels.map(l => l.id), 0) + 1;
      this.levels.push({ ...this.currentLevel });
    }
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog = false;
    this.isEditing = false;
  }
}
