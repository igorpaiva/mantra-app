ALTER TABLE public.deck
    ADD COLUMN user_id TEXT NOT NULL;

ALTER TABLE public.deck
    ADD CONSTRAINT fk_deck_user
        FOREIGN KEY (user_id)
            REFERENCES public.users (id)
            ON DELETE CASCADE;