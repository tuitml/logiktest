import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { KEEP, STEUERUNG_AN } from './field.model';
import type { FieldModule } from './field-module';
import { FieldStore } from './field-store';
import type { RuleContext } from './rule-context';
import { NO_SERVICES } from './rule-context';

/** a -> b: wenn a === 'x', dann b := 'y' (Datenmanipulation von b). */
const fieldA: FieldModule<string, RuleContext> = {
  id: 'a',
  label: 'A',
  type: 'text',
  dependencies: [],
  steuerung: () => STEUERUNG_AN,
};

const fieldB: FieldModule<string, RuleContext> = {
  id: 'b',
  label: 'B',
  type: 'text',
  dependencies: ['a'],
  steuerung: () => STEUERUNG_AN,
  datenmanipulation: (ctx) => (ctx.value('a') === 'x' ? 'y' : KEEP),
};

function newStore(injector: Injector): FieldStore<RuleContext> {
  return new FieldStore<RuleContext>(
    [fieldA, fieldB],
    (s) => ({
      value: <T>(id: string) => s.field<T>(id).value(),
      field: (id: string) => {
        const rt = s.field(id);
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
          get options() {
            return rt.options();
          },
          value: <T>() => rt.value() as T | undefined,
        };
      },
      auth: { permission: () => 'none' },
      services: NO_SERVICES,
    }),
    injector,
  );
}

describe('RuleEngine / FieldStore', () => {
  let injector: Injector;
  beforeEach(() => {
    injector = TestBed.inject(Injector);
  });

  it('wendet Datenmanipulation bei einer Benutzeränderung an', () => {
    const store = newStore(injector);
    store.applyUserChange('a', 'x');
    expect(store.field('b').value()).toBe('y');
  });

  it('lässt importierte Werte durch die Regeln UNANGETASTET', () => {
    const store = newStore(injector);
    store.applyImport({ a: 'x', b: 'importiert' });
    expect(store.field('b').value()).toBe('importiert');
  });

  it('reaktiviert die Regeln erst bei der nächsten Benutzeränderung', () => {
    const store = newStore(injector);
    store.applyImport({ a: 'x', b: 'importiert' });
    store.applyUserChange('a', 'x');
    expect(store.field('b').value()).toBe('y');
  });
});
