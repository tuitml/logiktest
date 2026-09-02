import { TestBed } from '@angular/core/testing';

import { AuthStore } from '../../../core/auth/auth.store';
import { DeckungStore } from '../../deckungen/deckung.store';
import { VertragsdatenStore } from '../vertragsdaten.store';
import { VersichererFieldComponent } from './versicherer-field.component';

describe('VersichererFieldComponent – Deckungen bei Versichererwechsel', () => {
  let deckungen: DeckungStore;
  let vertragsdaten: VertragsdatenStore;
  let aendern: (wert: unknown) => void;

  beforeEach(() => {
    TestBed.inject(AuthStore).setzeRollen(['RBBER_HUK', 'RBBER_VRK']);
    vertragsdaten = TestBed.inject(VertragsdatenStore);
    vertragsdaten.store.zuruecksetzen();
    deckungen = TestBed.inject(DeckungStore);
    deckungen.initialisieren();

    const fixture = TestBed.createComponent(VersichererFieldComponent);
    const komponente = fixture.componentInstance as unknown as { aendern(w: unknown): void };
    aendern = (w) => komponente.aendern(w);
  });

  it('verwirft alle Deckungen und startet neu mit der Default-Deckung des neuen Versicherers', () => {
    deckungen.hinzufuegen();
    expect(deckungen.deckungen().length).toBe(2);

    aendern('VRK');

    expect(deckungen.deckungen().length).toBe(1);
    expect(deckungen.deckungen()[0].risikoartWert()).toBe('300023'); // VRK-Standard
  });

  it('lässt die Deckungen unangetastet, wenn sich der Versicherer nicht ändert', () => {
    deckungen.hinzufuegen();
    const vorher = deckungen.deckungen();

    aendern(vertragsdaten.store.feld('versicherer').rohWert()); // gleicher Wert

    expect(deckungen.deckungen()).toBe(vorher);
    expect(deckungen.deckungen().length).toBe(2);
  });
});
