import { TestBed } from '@angular/core/testing';

import { VertragsdatenStore } from './vertragsdaten.store';

describe('Vertragsdaten – Import', () => {
  let store: VertragsdatenStore;

  beforeEach(() => {
    store = TestBed.inject(VertragsdatenStore);
    store.store.zuruecksetzen();
    // Bewusst inkonsistent: ARB würde aus "N1526" eigentlich 2015 ergeben.
    store.store.importieren({
      versicherer: 'HCR',
      tarif: 'N1526',
      arb: 2025,
      sbStaffel: 250,
      lebenssituation: 'SINGLE',
    });
  });

  it('setzt genau die importierten Werte – Datenmanipulation überschreibt NICHT', () => {
    expect(store.store.feld("arb").rohWert()).toBe(2025); // nicht auf 2015 abgeleitet
    expect(store.store.feld('tarif').rohWert()).toBe('N1526');
    expect(store.store.feld('sbStaffel').rohWert()).toBe(250);
  });

  it('Steuerungslogik läuft trotzdem korrekt (abgeleitet aus den importierten Werten)', () => {
    // ARB 2025 < 2026 -> Lebenssituation nicht sichtbar / nicht relevant
    const st = store.store.feld('lebenssituation').steuerung();
    expect(st.sichtbar).toBe(false);
    expect(st.relevant).toBe(false);
    // ARB 2025 >= 2025 -> Preisstand sichtbar, aber nicht bearbeitbar
    expect(store.store.feld('preisstand').steuerung()).toEqual({
      sichtbar: true,
      bearbeitbar: false,
      relevant: true,
    });
  });

  it('Wertebereichslogik läuft trotzdem – inkonsistente Auswahl wird als ungültig erkannt', () => {
    // ARB 2025 -> SBStaffel-Optionen 150/300, importierte 250 ist nicht dabei
    expect(store.store.feld('sbStaffel').optionen().map((o) => o.wert)).toEqual([150, 300]);
    expect(store.store.feld('sbStaffel').gueltig()).toBe(false);
  });

  it('Regeln greifen wieder ab der nächsten Benutzeränderung', () => {
    store.store.benutzerAenderung('tarif', 'N1526');
    expect(store.store.feld('arb').rohWert()).toBe(2015); // jetzt abgeleitet
  });
});
