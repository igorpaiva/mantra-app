import { Card } from "./card.type";

export type Deck = {
    id?: number;
    name: string;
    description: string;
    cards: Array<Card>;
}

export interface CreateDeckRequest {
    name: string;
    description: string;
    cards: Omit<Card, 'id'>[];  // Remove local 'id' property when sending to server
}