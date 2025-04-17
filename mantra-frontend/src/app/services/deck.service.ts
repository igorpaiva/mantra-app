import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deck, CreateDeckRequest } from '../model/deck.type';
import { camelToSnakeCase } from '../utils/case-converter';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  getDecks(): Observable<Deck[]> {
    return this.http.get<Deck[]>(`${this.apiUrl}/deck`);
  }
  
  getDeck(id: string): Observable<Deck> {
    return this.http.get<Deck>(`${this.apiUrl}/deck/${id}`);
  }
  
  createDeck(deck: CreateDeckRequest): Observable<Deck> {
    return this.http.post<Deck>(`${this.apiUrl}/deck`, deck);
  }
  
  updateDeck(id: string, deck: CreateDeckRequest): Observable<Deck> {
    return this.http.put<Deck>(`${this.apiUrl}/deck/${id}`, deck);
  }
  
  deleteDeck(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deck/${id}`);
  }
}