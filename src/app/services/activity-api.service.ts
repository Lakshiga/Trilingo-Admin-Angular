import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Activity } from '../types/activity.types';

export type ActivityCreateDto = Omit<Activity, 'activityId' | 'activityType' | 'mainActivity'>;
export type ActivityUpdateDto = Omit<Activity, 'activityId' | 'activityType' | 'mainActivity'>;

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService {
  private readonly endpoint = '/activities';

  constructor(private httpClient: HttpClientService) {}

  // GET all activities for a specific lesson
  getActivitiesByLessonId(lessonId: number | string): Observable<Activity[]> {
    return this.httpClient.get<Activity[]>(`/lessons/${lessonId}/activities`);
  }

  // GET a single activity by its own ID
  getActivityById(activityId: number | string): Observable<Activity> {
    return this.httpClient.get<Activity>(`${this.endpoint}/${activityId}`);
  }

  // POST a new activity
  create(newItem: ActivityCreateDto): Observable<Activity> {
    return this.httpClient.post<Activity, ActivityCreateDto>(this.endpoint, newItem);
  }

  // PUT (update) an existing activity
  update(id: number | string, itemToUpdate: ActivityUpdateDto): Observable<void> {
    return this.httpClient.put(`${this.endpoint}/${id}`, itemToUpdate);
  }

  // DELETE an activity
  delete(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }

  // GET all activities by lesson ID (alias for getActivitiesByLessonId)
  getAllByLessonId(lessonId: number | string): Observable<Activity[]> {
    return this.getActivitiesByLessonId(lessonId);
  }

  // GET activity by ID (alias for getActivityById)
  getById(activityId: number | string): Observable<Activity> {
    return this.getActivityById(activityId);
  }

  // DELETE activity (alias for delete)
  deleteItem(activityId: number | string): Observable<void> {
    return this.delete(activityId);
  }
}
