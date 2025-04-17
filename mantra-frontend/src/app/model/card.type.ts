export type Card = {
    id?: number;
    term: string;
    definition: string;
    cardNumber: number;
    deckId?: number;
    isNew?: boolean;
    isDeleted?: boolean;
}