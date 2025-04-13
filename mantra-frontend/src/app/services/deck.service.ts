import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deck, CreateDeckRequest } from '../model/deck.type';
import { camelToSnakeCase } from '../utils/case-converter';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }
  
  getDecks(): Observable<Deck[]> {
    return this.http.get<Deck[]>(`${this.apiUrl}/deck`);
  }
  
  getDeck(id: string): Observable<Deck> {
    return this.http.get<Deck>(`${this.apiUrl}/deck/${id}`);
  }
  
  createDeck(deck: CreateDeckRequest): Observable<Deck> {
    const snakeCaseDeck = camelToSnakeCase(deck);
    return this.http.post<Deck>(`${this.apiUrl}/deck`, snakeCaseDeck);
  }
  
  updateDeck(id: string, deck: CreateDeckRequest): Observable<Deck> {
    const snakeCaseDeck = camelToSnakeCase(deck);
    return this.http.put<Deck>(`${this.apiUrl}/deck/${id}`, snakeCaseDeck);
  }
  
  deleteDeck(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deck/${id}`);
  }
}