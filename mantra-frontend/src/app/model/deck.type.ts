import { Card } from "./card.type";

export type Deck = {
    id: number;
    name: string;
    description: string;
    cards: Array<Card>;
}