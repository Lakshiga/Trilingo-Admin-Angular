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

interface MainActivity {
  id: number;
  name: string;
  description: string;
  learningStage: 'letters' | 'words' | 'sentences';
  isActive: boolean;
}

@Component({
  selector: 'app-main-activities',
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
    MatTableModule
  ],
  template: `
    <div class="main-activities-container">
      <div class="header">
        <h2>🎯 Main Activities Management</h2>
        <button mat-raised-button color="primary" (click)="openAddMainActivityDialog()">
          <mat-icon>add</mat-icon>
          Add New Main Activity
        </button>
      </div>

      <div class="content">
        <mat-card>
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="mainActivities" class="main-activities-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let activity">{{ activity.name }}</td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let activity">{{ activity.description }}</td>
                </ng-container>

                <ng-container matColumnDef="learningStage">
                  <th mat-header-cell *matHeaderCellDef>Stage</th>
                  <td mat-cell *matCellDef="let activity">
                    <span class="stage-badge" [class]="'stage-' + activity.learningStage">
                      {{ activity.learningStage | titlecase }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let activity">
                    <span class="status-badge" [class]="activity.isActive ? 'active' : 'inactive'">
                      {{ activity.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let activity">
                    <button mat-icon-button color="primary" (click)="editMainActivity(activity)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteMainActivity(activity)">
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

    <!-- Add/Edit Main Activity Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Main Activity' : 'Add New Main Activity' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form class="main-activity-form" (ngSubmit)="saveMainActivity()">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput [(ngModel)]="currentMainActivity.name" name="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="currentMainActivity.description" name="description" rows="3"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Learning Stage</mat-label>
            <mat-select [(ngModel)]="currentMainActivity.learningStage" name="learningStage" required>
              <mat-option value="letters">Letters</mat-option>
              <mat-option value="words">Words</mat-option>
              <mat-option value="sentences">Sentences</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeDialog()">Cancel</button>
            <button mat-raised-button color="primary" type="submit">
              {{ isEditing ? 'Update' : 'Add' }} Main Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .main-activities-container {
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

    .main-activities-table {
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

    .main-activity-form {
      padding: 20px;
    }

    .main-activity-form mat-form-field {
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
export class MainActivitiesComponent implements OnInit {
  mainActivities: MainActivity[] = [];
  displayedColumns: string[] = ['name', 'description', 'learningStage', 'isActive', 'actions'];
  showDialog = false;
  isEditing = false;
  currentMainActivity: MainActivity = {
    id: 0,
    name: '',
    description: '',
    learningStage: 'letters',
    isActive: true
  };

  constructor() {}

  ngOnInit() {
    this.loadMainActivities();
  }

  loadMainActivities() {
    // Mock data - replace with actual API call
    this.mainActivities = [
      {
        id: 1,
        name: 'Letter Recognition',
        description: 'Identify and recognize Tamil letters',
        learningStage: 'letters',
        isActive: true
      },
      {
        id: 2,
        name: 'Word Formation',
        description: 'Form words using learned letters',
        learningStage: 'words',
        isActive: true
      },
      {
        id: 3,
        name: 'Sentence Construction',
        description: 'Build sentences using learned words',
        learningStage: 'sentences',
        isActive: false
      }
    ];
  }

  openAddMainActivityDialog() {
    this.isEditing = false;
    this.currentMainActivity = {
      id: 0,
      name: '',
      description: '',
      learningStage: 'letters',
      isActive: true
    };
    this.showDialog = true;
  }

  editMainActivity(activity: MainActivity) {
    this.isEditing = true;
    this.currentMainActivity = { ...activity };
    this.showDialog = true;
  }

  deleteMainActivity(activity: MainActivity) {
    if (confirm(`Are you sure you want to delete "${activity.name}"?`)) {
      this.mainActivities = this.mainActivities.filter(a => a.id !== activity.id);
    }
  }

  saveMainActivity() {
    if (this.isEditing) {
      const index = this.mainActivities.findIndex(a => a.id === this.currentMainActivity.id);
      if (index !== -1) {
        this.mainActivities[index] = { ...this.currentMainActivity };
      }
    } else {
      this.currentMainActivity.id = Math.max(...this.mainActivities.map(a => a.id), 0) + 1;
      this.mainActivities.push({ ...this.currentMainActivity });
    }
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog = false;
    this.isEditing = false;
  }
}
