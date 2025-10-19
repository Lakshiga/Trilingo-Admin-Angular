import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface ActivityType {
  id: number;
  activityName: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-activity-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="activity-types-container">
      <div class="header">
        <h2>🏷️ Activity Types Management</h2>
        <button mat-raised-button color="primary" (click)="openAddActivityTypeDialog()">
          <mat-icon>add</mat-icon>
          Add New Activity Type
        </button>
      </div>

      <div class="content">
        <mat-card>
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="activityTypes" class="activity-types-table">
                <ng-container matColumnDef="activityName">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let type">{{ type.activityName }}</td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let type">{{ type.description }}</td>
                </ng-container>

                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let type">
                    <span class="status-badge" [class]="type.isActive ? 'active' : 'inactive'">
                      {{ type.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let type">
                    <button mat-icon-button color="primary" (click)="editActivityType(type)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteActivityType(type)">
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

    <!-- Add/Edit Activity Type Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Activity Type' : 'Add New Activity Type' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form class="activity-type-form" (ngSubmit)="saveActivityType()">
          <mat-form-field appearance="outline">
            <mat-label>Activity Name</mat-label>
            <input matInput [(ngModel)]="currentActivityType.activityName" name="activityName" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="currentActivityType.description" name="description" rows="3"></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeDialog()">Cancel</button>
            <button mat-raised-button color="primary" type="submit">
              {{ isEditing ? 'Update' : 'Add' }} Activity Type
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .activity-types-container {
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

    .activity-types-table {
      width: 100%;
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

    .activity-type-form {
      padding: 20px;
    }

    .activity-type-form mat-form-field {
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
export class ActivityTypesComponent implements OnInit {
  activityTypes: ActivityType[] = [];
  displayedColumns: string[] = ['activityName', 'description', 'isActive', 'actions'];
  showDialog = false;
  isEditing = false;
  currentActivityType: ActivityType = {
    id: 0,
    activityName: '',
    description: '',
    isActive: true
  };

  constructor() {}

  ngOnInit() {
    this.loadActivityTypes();
  }

  loadActivityTypes() {
    // Mock data - replace with actual API call
    this.activityTypes = [
      {
        id: 1,
        activityName: 'Multiple Choice',
        description: 'Choose the correct answer from multiple options',
        isActive: true
      },
      {
        id: 2,
        activityName: 'Drag and Drop',
        description: 'Drag items to their correct positions',
        isActive: true
      },
      {
        id: 3,
        activityName: 'Fill in the Blanks',
        description: 'Complete sentences by filling in missing words',
        isActive: true
      },
      {
        id: 4,
        activityName: 'Audio Matching',
        description: 'Match audio with corresponding text or images',
        isActive: false
      }
    ];
  }

  openAddActivityTypeDialog() {
    this.isEditing = false;
    this.currentActivityType = {
      id: 0,
      activityName: '',
      description: '',
      isActive: true
    };
    this.showDialog = true;
  }

  editActivityType(type: ActivityType) {
    this.isEditing = true;
    this.currentActivityType = { ...type };
    this.showDialog = true;
  }

  deleteActivityType(type: ActivityType) {
    if (confirm(`Are you sure you want to delete "${type.activityName}"?`)) {
      this.activityTypes = this.activityTypes.filter(t => t.id !== type.id);
    }
  }

  saveActivityType() {
    if (this.isEditing) {
      const index = this.activityTypes.findIndex(t => t.id === this.currentActivityType.id);
      if (index !== -1) {
        this.activityTypes[index] = { ...this.currentActivityType };
      }
    } else {
      this.currentActivityType.id = Math.max(...this.activityTypes.map(t => t.id), 0) + 1;
      this.activityTypes.push({ ...this.currentActivityType });
    }
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog = false;
    this.isEditing = false;
  }
}
