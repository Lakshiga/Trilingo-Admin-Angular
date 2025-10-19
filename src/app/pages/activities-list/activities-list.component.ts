import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivityPlayerModalComponent } from '../../components/activities/activity-player-modal.component';
import { ActivityApiService } from '../../services/activity-api.service';
import { LessonApiService } from '../../services/lesson-api.service';
import { Activity } from '../../types/activity.types';
import { Lesson } from '../../types/lesson.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
    ActivityPlayerModalComponent
  ],
  template: `
    <div class="activities-list-page">
      <div class="header">
        <button 
          mat-icon-button 
          (click)="goBack()" 
          [disabled]="isLoading">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Lessons</span>
        </button>
        
        <div class="title-section">
          <h1>{{ isLoading ? 'Loading...' : 'Activities for: "' + (lesson?.lessonName || '') + '"' }}</h1>
          <button 
            mat-raised-button 
            color="primary"
            [routerLink]="['/activity-edit']"
            [queryParams]="{lessonId: lessonId}"
            [disabled]="!lessonId || isLoading">
            <mat-icon>add</mat-icon>
            Add New Activity
          </button>
        </div>
      </div>
      
      <div class="table-container" *ngIf="!error">
        <table mat-table [dataSource]="activities" class="activities-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let activity">{{ activity.activityId }}</td>
          </ng-container>
          
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let activity">{{ activity.title }}</td>
          </ng-container>
          
          <ng-container matColumnDef="order">
            <th mat-header-cell *matHeaderCellDef>Order</th>
            <td mat-cell *matCellDef="let activity">{{ activity.sequenceOrder }}</td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let activity">
              <button 
                mat-icon-button 
                color="primary"
                (click)="openPreview(activity.activityId)"
                title="Preview Activity">
                <mat-icon>visibility</mat-icon>
              </button>
              <button 
                mat-icon-button 
                color="primary"
                [routerLink]="['/activity-edit']"
                [queryParams]="{activityId: activity.activityId}">
                <mat-icon>edit</mat-icon>
              </button>
              <button 
                mat-icon-button 
                color="warn"
                (click)="deleteActivity(activity.activityId)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <div class="loading-row" *ngIf="isLoading">
          <mat-spinner></mat-spinner>
        </div>
        
        <div class="no-data-row" *ngIf="!isLoading && activities.length === 0">
          <p>No activities found for this lesson.</p>
        </div>
      </div>
      
      <div class="error-message" *ngIf="error">
        <mat-card>
          <mat-card-content>
            <p>{{ error }}</p>
          </mat-card-content>
        </mat-card>
      </div>
      
      <app-activity-player-modal
        [isOpen]="isPreviewOpen"
        (onClose)="closePreview()"
        [activity]="activityToPreview"
        [isLoading]="isPreviewLoading">
      </app-activity-player-modal>
    </div>
  `,
  styles: [`
    .activities-list-page {
      padding: 24px;
    }

    .header {
      margin-bottom: 24px;
    }

    .title-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
    }

    .title-section h1 {
      margin: 0;
    }

    .table-container {
      margin-top: 16px;
    }

    .activities-table {
      width: 100%;
    }

    .loading-row, .no-data-row {
      text-align: center;
      padding: 32px;
    }

    .error-message {
      margin-top: 16px;
    }

    .error-message mat-card {
      max-width: 500px;
      margin: 0 auto;
    }
  `]
})
export class ActivitiesListPageComponent implements OnInit, OnDestroy {
  lessonId: string | null = null;
  activities: Activity[] = [];
  lesson: Lesson | null = null;
  isLoading = true;
  error: string | null = null;
  
  isPreviewOpen = false;
  activityToPreview: Activity | null = null;
  isPreviewLoading = false;
  
  displayedColumns: string[] = ['id', 'title', 'order', 'actions'];
  
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityApiService: ActivityApiService,
    private lessonApiService: LessonApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.lessonId = params['lessonId'];
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private async loadData(): Promise<void> {
    if (!this.lessonId) {
      this.error = "Error: No Lesson ID provided.";
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    try {
      const lessonObservable = this.lessonApiService.getLessonById(parseInt(this.lessonId, 10));
      const activitiesObservable = this.activityApiService.getAllByLessonId(parseInt(this.lessonId, 10));
      
      const [lessonData, activitiesData] = await Promise.all([
        lessonObservable.toPromise(),
        activitiesObservable.toPromise()
      ]);
      
      this.lesson = lessonData!;
      this.activities = activitiesData!;
    } catch (err) {
      console.error(err);
      this.error = err instanceof Error ? err.message : "Failed to load data for this lesson.";
    } finally {
      this.isLoading = false;
    }
  }

  async deleteActivity(activityId: number): Promise<void> {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await this.activityApiService.deleteItem(activityId);
        this.activities = this.activities.filter(act => act.activityId !== activityId);
        this.snackBar.open('Activity deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error(err);
        this.snackBar.open(
          err instanceof Error ? err.message : "Failed to delete activity.",
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  async openPreview(activityId: number): Promise<void> {
    this.isPreviewOpen = true;
    this.isPreviewLoading = true;
    
    try {
      const fullActivityData = await this.activityApiService.getById(activityId).toPromise();
      this.activityToPreview = fullActivityData!;
    } catch (err) {
      console.error("Failed to fetch activity details for preview", err);
      this.snackBar.open("Could not load activity preview.", 'Close', { duration: 5000 });
      this.isPreviewOpen = false;
    } finally {
      this.isPreviewLoading = false;
    }
  }

  closePreview(): void {
    this.isPreviewOpen = false;
    this.activityToPreview = null;
  }

  goBack(): void {
    const backToLessonsUrl = this.lesson ? 
      `/lessons?levelId=${this.lesson.levelId}` : 
      '/levels';
    this.router.navigate([backToLessonsUrl]);
  }
}