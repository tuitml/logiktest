import { TestBed } from '@angular/core/testing';

import { AuthStore } from '../../core/auth/auth.store';
import { DeckungStore } from '../../domain/deckungen/deckung.store';
import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';
import { FormularStore } from './formular.store';

describe('FormularStore – Import vom Backend', () => {
  it('belegt Vertragsdaten und Deckungen aus der Backend-Vorbelegung vor', async () => {
    TestBed.inject(AuthStore).setClaims(['huk', 'vrk']);
    const vertragsdaten = TestBed.inject(VertragsdatenStore);
    const deckungen = TestBed.inject(DeckungStore);
    const store = TestBed.inject(FormularStore);

    await store.importFromBackend();

    expect(vertragsdaten.store.field('versicherer').value()).toBe('VRK');
    expect(vertragsdaten.store.field('tarif').value()).toBe('N1826');
    expect(vertragsdaten.store.field('arb').value()).toBe(2018);
    expect(vertragsdaten.store.field('sbStaffel').value()).toBe(250);
    expect(vertragsdaten.store.field('tarifgruppe').value()).toBe('NICHT_OED');
    expect(vertragsdaten.store.field('berufsklasse').value()).toBe(
      'MITARBEITER_SOZIALE_EINRICHTUNGEN',
    );

    expect(deckungen.deckungen().length).toBe(1);
    expect(deckungen.deckungen()[0].risikoartValue()).toBe('300023');

    expect(store.importHint()).toContain('Backend übernommen');
  });
});
