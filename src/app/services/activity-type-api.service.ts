import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityType } from '../types/activity-type.types';

export interface ActivityTypeCreateDto {
  activityName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityTypeApiService {
  private readonly endpoint = '/activitytypes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>(this.endpoint);
  }

  create(newItem: ActivityTypeCreateDto): Observable<ActivityType> {
    return this.http.post<ActivityType>(this.endpoint, newItem);
  }

  update(id: number, itemToUpdate: Partial<ActivityTypeCreateDto>): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}`, itemToUpdate);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
