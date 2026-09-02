import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BEHALTEN, setze, STEUERUNG_AN } from './feld.model';
import type { FeldModul } from './feld-modul';
import { FeldStore } from './feld-store';
import type { RegelKontext } from './regel-kontext';
import { KEINE_DIENSTE } from './regel-kontext';

/** a -> b: wenn a === 'x', dann b := 'y' (Datenmanipulation von b). */
const feldA: FeldModul<string, RegelKontext> = {
  id: 'a',
  label: 'A',
  typ: 'text',
  abhaengigkeiten: [],
  steuerung: () => STEUERUNG_AN,
};

const feldB: FeldModul<string, RegelKontext> = {
  id: 'b',
  label: 'B',
  typ: 'text',
  abhaengigkeiten: ['a'],
  steuerung: () => STEUERUNG_AN,
  datenmanipulation: (ctx) => (ctx.wert('a') === 'x' ? setze('y') : BEHALTEN),
};

function neuerStore(injector: Injector): FeldStore<RegelKontext> {
  return new FeldStore<RegelKontext>(
    [feldA, feldB],
    (s) => ({
      wert: <T>(id: string) => s.feld<T>(id).rohWert(),
      feld: (id: string) => {
        const rt = s.feld(id);
        return {
          get sichtbar() {
            return rt.steuerung().sichtbar;
          },
          get bearbeitbar() {
            return rt.steuerung().bearbeitbar;
          },
          get relevant() {
            return rt.steuerung().relevant;
          },
          get gueltig() {
            return rt.gueltig();
          },
          get optionen() {
            return rt.optionen();
          },
          wert: <T>() => rt.rohWert() as T | undefined,
        };
      },
      auth: {
        rollen: () => [],
        hatRolle: () => false,
        hatNurRolle: () => false,
        hatAlleRollen: () => false,
      },
      dienste: KEINE_DIENSTE,
    }),
    injector,
  );
}

describe('RegelEngine / FeldStore', () => {
  let injector: Injector;
  beforeEach(() => {
    injector = TestBed.inject(Injector);
  });

  it('wendet Datenmanipulation bei einer Benutzeränderung an', () => {
    const store = neuerStore(injector);
    store.benutzerAenderung('a', 'x');
    expect(store.feld('b').rohWert()).toBe('y');
  });

  it('lässt importierte Werte durch die Regeln UNANGETASTET', () => {
    const store = neuerStore(injector);
    store.importieren({ a: 'x', b: 'importiert' });
    expect(store.feld('b').rohWert()).toBe('importiert');
  });

  it('reaktiviert die Regeln erst bei der nächsten Benutzeränderung', () => {
    const store = neuerStore(injector);
    store.importieren({ a: 'x', b: 'importiert' });
    store.benutzerAenderung('a', 'x');
    expect(store.feld('b').rohWert()).toBe('y');
  });
});
