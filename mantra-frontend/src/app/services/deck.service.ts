import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Deck } from '../model/deck.type';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  http = inject(HttpClient);
  getDecks() {
    const url = 'http://localhost:8080/api/v1/deck';
    // const url = 'https://679bea0933d31684632583b8.mockapi.io/api/v1/deck'
    return this.http.get<Array<Deck>>(url);
  }
}
