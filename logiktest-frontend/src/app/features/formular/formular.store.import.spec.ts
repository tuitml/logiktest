import { TestBed } from '@angular/core/testing';

import { AuthStore } from '../../core/auth/auth.store';
import { DeckungStore } from '../../domain/deckungen/deckung.store';
import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';
import { FormularStore } from './formular.store';

describe('FormularStore – Import vom Backend', () => {
  it('belegt Vertragsdaten und Deckungen aus der Backend-Vorbelegung vor', async () => {
    TestBed.inject(AuthStore).setzeRollen(['RBBER_HUK', 'RBBER_VRK']);
    const vertragsdaten = TestBed.inject(VertragsdatenStore);
    const deckungen = TestBed.inject(DeckungStore);
    const store = TestBed.inject(FormularStore);

    await store.importierenVomBackend();

    expect(vertragsdaten.store.feld('versicherer').rohWert()).toBe('VRK');
    expect(vertragsdaten.store.feld('tarif').rohWert()).toBe('N1826');
    expect(vertragsdaten.store.feld('arb').rohWert()).toBe(2018);
    expect(vertragsdaten.store.feld('sbStaffel').rohWert()).toBe(250);
    expect(vertragsdaten.store.feld('tarifgruppe').rohWert()).toBe('NICHT_OED');
    expect(vertragsdaten.store.feld('berufsklasse').rohWert()).toBe(
      'MITARBEITER_SOZIALE_EINRICHTUNGEN',
    );

    expect(deckungen.deckungen().length).toBe(1);
    expect(deckungen.deckungen()[0].risikoartWert()).toBe('300023');

    expect(store.importHinweis()).toContain('Backend übernommen');
  });
});
