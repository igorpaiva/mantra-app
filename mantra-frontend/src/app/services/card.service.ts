import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) { }

  deleteCard(cardId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/card/${cardId}`);
  }
}
