import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Lesson } from '../types/lesson.types';

export type LessonCreateDto = Omit<Lesson, 'lessonId' | 'levelId' | 'level'>;

@Injectable({
  providedIn: 'root'
})
export class LessonApiService {
  private readonly endpoint = '/lessons';

  constructor(private httpClient: HttpClientService) {}

  // GET lessons for a specific level
  getLessonsByLevelId(levelId: number | string): Observable<Lesson[]> {
    return this.httpClient.get<Lesson[]>(`/levels/${levelId}/lessons`);
  }

  // POST a new lesson
  create(newItem: LessonCreateDto & { levelId: number }): Observable<Lesson> {
    return this.httpClient.post<Lesson, typeof newItem>(this.endpoint, newItem);
  }

  // PUT (update) an existing lesson
  update(id: number | string, itemToUpdate: Partial<LessonCreateDto>): Observable<void> {
    return this.httpClient.put(`${this.endpoint}/${id}`, itemToUpdate);
  }

  // DELETE a lesson
  delete(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }

  // GET a single lesson by its ID (useful for getting the parent lesson name)
  getLessonById(lessonId: number | string): Observable<Lesson> {
    return this.httpClient.get<Lesson>(`${this.endpoint}/${lessonId}`);
  }

  // DELETE lesson (alias for delete)
  deleteItem(lessonId: number | string): Observable<void> {
    return this.delete(lessonId);
  }
}
