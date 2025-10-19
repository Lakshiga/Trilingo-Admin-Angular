import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { MainActivity } from '../types/main-activity.types';

export type MainActivityCreateDto = Omit<MainActivity, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class MainActivityApiService {
  private readonly endpoint = '/mainactivities';

  constructor(private httpClient: HttpClientService) {}

  // GET all main activities
  getAll(): Observable<MainActivity[]> {
    return this.httpClient.get<MainActivity[]>(this.endpoint);
  }

  // POST a new main activity
  create(newItem: MainActivityCreateDto): Observable<MainActivity> {
    return this.httpClient.post<MainActivity, MainActivityCreateDto>(this.endpoint, newItem);
  }

  // PUT (update) an existing main activity
  update(id: number | string, itemToUpdate: Partial<MainActivityCreateDto>): Observable<void> {
    return this.httpClient.put(`${this.endpoint}/${id}`, itemToUpdate);
  }

  // DELETE a main activity
  deleteItem(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
