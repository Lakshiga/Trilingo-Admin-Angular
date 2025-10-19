import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level } from '../types/level.types';

export interface LevelCreateDto {
  levelName: string;
  description?: string;
  sequenceOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class LevelApiService {
  private readonly endpoint = '/levels';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Level[]> {
    return this.http.get<Level[]>(this.endpoint);
  }

  create(newItem: LevelCreateDto): Observable<Level> {
    return this.http.post<Level>(this.endpoint, newItem);
  }

  update(id: number, itemToUpdate: Partial<LevelCreateDto>): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}`, itemToUpdate);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}