import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  deleteCard(cardId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/card/${cardId}`);
  }
}
