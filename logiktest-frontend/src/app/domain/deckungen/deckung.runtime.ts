import { computed, Injector, signal, type Signal } from '@angular/core';

import { FieldStore } from '../../core/engine';
import type { AuthReader, FieldId, FieldView } from '../../core/engine';
import {
  buildDeckungContext,
  buildFahrzeugContext,
  buildNutzungContext,
  type DeckungContext,
  type FahrzeugContext,
  type NutzungContext,
} from './deckung.context';
import { DECKUNG_FIELDS } from './deckung.fields';
import { FAHRZEUG_FIELDS } from './fahrzeug/wagniskennziffer.field';
import { NUTZUNG_FIELDS } from './grundstueck/nutzung.fields';
import { capacity, type DeckungCapacity } from './capacity';
import type {
  DeckungValues,
  FahrzeugValues,
  GrundstueckValues,
  NutzungValues,
  RisikoartId,
  Wagniskennziffer,
} from './deckung.types';
import type {
  ImportDeckung,
  ImportFahrzeug,
  ImportGrundstueck,
  ImportNutzung,
} from '../import/import.model';

const newId = (): string => crypto.randomUUID();

interface NutzungEnvIn {
  auth: AuthReader;
  deckungRisikoart: () => RisikoartId | undefined;
}
interface FahrzeugEnvIn {
  auth: AuthReader;
  arb: () => number | undefined;
  deckungRisikoart: () => RisikoartId | undefined;
}

/* ----------------------------------------------------------------------------
 * Nutzung
 * ------------------------------------------------------------------------- */
export class NutzungRuntime {
  readonly id = newId();
  private readonly fields: FieldStore<NutzungContext>;

  constructor(env: NutzungEnvIn, injector: Injector) {
    this.fields = new FieldStore<NutzungContext>(
      NUTZUNG_FIELDS,
      (s) => buildNutzungContext(s, env),
      injector,
    );
  }

  initialize(): void {
    this.fields.initialize();
  }

  /** Import: Werte übernehmen, OHNE Regeln laufen zu lassen. */
  applyImport(data: ImportNutzung): void {
    this.fields.applyImport({ nutzungsart: data.nutzungsart, wert: data.wert });
  }

  nutzungsartView(): FieldView {
    return this.fields.field('nutzungsart').view();
  }
  wertView(): FieldView {
    return this.fields.field('wert').view();
  }
  nutzungsartValue(): string | undefined {
    return this.fields.field<string>('nutzungsart').value();
  }

  setNutzungsart(value: string | undefined): void {
    const before = this.nutzungsartValue();
    this.fields.applyUserChange('nutzungsart', value);
    if (before !== value) {
      // Nutzungsart gewechselt -> Wert zurücksetzen
      this.fields.applyUserChange('wert', undefined);
    }
  }
  setWert(value: number | undefined): void {
    this.fields.applyUserChange('wert', value);
  }

  readonly valid = computed(
    () => this.fields.field('nutzungsart').gueltig() && this.fields.field('wert').gueltig(),
  );

  payload(): NutzungValues {
    return { nutzungsart: this.nutzungsartValue(), wert: this.fields.field<number>('wert').value() };
  }
}

/* ----------------------------------------------------------------------------
 * Grundstück
 * ------------------------------------------------------------------------- */
export class GrundstueckRuntime {
  readonly id = newId();
  private readonly _nutzungen = signal<ReadonlyArray<NutzungRuntime>>([]);
  readonly nutzungen = this._nutzungen.asReadonly();

  constructor(
    private readonly env: NutzungEnvIn,
    private readonly injector: Injector,
  ) {}

  initialize(): void {
    this._nutzungen.set([]);
    this.addNutzung();
  }

  /** Import: exakt die übergebenen Nutzungen (keine Min-1-Regel, kein Regel-Durchlauf). */
  applyImport(data: ImportGrundstueck): void {
    this._nutzungen.set(
      data.nutzungen.map((n) => {
        const nr = this.createNutzung();
        nr.applyImport(n);
        return nr;
      }),
    );
  }

  private createNutzung(): NutzungRuntime {
    return new NutzungRuntime(this.env, this.injector);
  }

  addNutzung(): void {
    const n = this.createNutzung();
    n.initialize();
    this._nutzungen.update((l) => [...l, n]);
  }
  removeNutzung(n: NutzungRuntime): void {
    if (this._nutzungen().length <= 1) {
      return;
    }
    this._nutzungen.update((l) => l.filter((x) => x !== n));
  }
  readonly canRemoveNutzung = computed(() => this._nutzungen().length > 1);

  readonly valid = computed(
    () => this._nutzungen().length >= 1 && this._nutzungen().every((n) => n.valid()),
  );

  payload(): GrundstueckValues {
    return { nutzungen: this._nutzungen().map((n) => n.payload()) };
  }
}

/* ----------------------------------------------------------------------------
 * Fahrzeug
 * ------------------------------------------------------------------------- */
export class FahrzeugRuntime {
  readonly id = newId();
  private readonly fields: FieldStore<FahrzeugContext>;

  constructor(env: FahrzeugEnvIn, injector: Injector) {
    this.fields = new FieldStore<FahrzeugContext>(
      FAHRZEUG_FIELDS,
      (s) => buildFahrzeugContext(s, env),
      injector,
    );
  }

  initialize(): void {
    this.fields.initialize();
  }
  applyRules(): void {
    this.fields.applyRules();
  }

  /** Import: Wert übernehmen, OHNE Regeln laufen zu lassen. */
  applyImport(data: ImportFahrzeug): void {
    this.fields.applyImport({ wagniskennziffer: data.wagniskennziffer });
  }

  wagniskennzifferView(): FieldView {
    return this.fields.field('wagniskennziffer').view();
  }

  setWagniskennziffer(value: Wagniskennziffer | undefined): void {
    this.fields.applyUserChange('wagniskennziffer', value);
  }

  readonly valid = computed(() => this.fields.field('wagniskennziffer').gueltig());

  payload(): FahrzeugValues {
    return { wagniskennziffer: this.fields.field<Wagniskennziffer>('wagniskennziffer').value() };
  }
}

/* ----------------------------------------------------------------------------
 * Deckung
 * ------------------------------------------------------------------------- */
export interface DeckungEnvExtern {
  readonly auth: AuthReader;
  vertragValue<T = unknown>(id: FieldId): T | undefined;
  otherRisikoarten(self: DeckungRuntime): ReadonlyArray<RisikoartId>;
}

export class DeckungRuntime {
  readonly id = newId();
  private readonly fields: FieldStore<DeckungContext>;
  private readonly _fahrzeuge = signal<ReadonlyArray<FahrzeugRuntime>>([]);
  private readonly _grundstuecke = signal<ReadonlyArray<GrundstueckRuntime>>([]);
  readonly fahrzeuge = this._fahrzeuge.asReadonly();
  readonly grundstuecke = this._grundstuecke.asReadonly();

  constructor(
    private readonly env: DeckungEnvExtern,
    private readonly injector: Injector,
  ) {
    this.fields = new FieldStore<DeckungContext>(
      DECKUNG_FIELDS,
      (s) =>
        buildDeckungContext(s, {
          auth: env.auth,
          vertragValue: (id) => env.vertragValue(id),
          otherRisikoarten: () => env.otherRisikoarten(this),
        }),
      injector,
    );
  }

  initialize(): void {
    this.fields.initialize();
    this.syncChildren();
  }

  /**
   * Import: Risikoart/Rabatt/Zuschlag + Fahrzeuge/Grundstücke exakt übernehmen,
   * OHNE Regeln (kein `syncChildren`, keine Datenmanipulation).
   */
  applyImport(data: ImportDeckung): void {
    this.fields.applyImport({
      risikoart: data.risikoart,
      rabatt: data.rabatt,
      zuschlag: data.zuschlag,
    });
    this._fahrzeuge.set(
      data.fahrzeuge.map((f) => {
        const fz = this.createFahrzeug();
        fz.applyImport(f);
        return fz;
      }),
    );
    this._grundstuecke.set(
      data.grundstuecke.map((g) => {
        const gr = this.createGrundstueck();
        gr.applyImport(g);
        return gr;
      }),
    );
  }

  /** Regeln nach einer Änderung an einer Nachbar-Deckung neu bewerten. */
  applyRules(): void {
    this.fields.applyRules();
    this.syncChildren();
    this._fahrzeuge().forEach((f) => f.applyRules());
  }

  // --- Felder -------------------------------------------------------------
  risikoartValue(): RisikoartId | undefined {
    return this.fields.field<RisikoartId>('risikoart').value();
  }
  risikoartView(): FieldView {
    return this.fields.field('risikoart').view();
  }
  rabattView(): FieldView {
    return this.fields.field('rabatt').view();
  }
  zuschlagView(): FieldView {
    return this.fields.field('zuschlag').view();
  }

  setField(id: FieldId, value: unknown): void {
    const risikoartBefore = this.risikoartValue();
    this.fields.applyUserChange(id, value);
    if (id === 'risikoart' && risikoartBefore !== this.risikoartValue()) {
      // Risikoart gewechselt -> alle Fahrzeuge und Grundstücke entfernen
      this._fahrzeuge.set([]);
      this._grundstuecke.set([]);
      this.syncChildren();
    }
  }

  // --- Kapazität / Kinder ----------------------------------------------------
  readonly capacity: Signal<DeckungCapacity> = computed(() => capacity(this.risikoartValue()));

  private syncChildren(): void {
    const c = capacity(this.risikoartValue());

    if (c.fahrzeuge === 'none' && this._fahrzeuge().length > 0) {
      this._fahrzeuge.set([]);
    }
    if (c.fahrzeuge === 'required' && this._fahrzeuge().length === 0) {
      this.addFahrzeug();
    }
    if (c.grundstuecke === 'none' && this._grundstuecke().length > 0) {
      this._grundstuecke.set([]);
    }
    if (c.grundstuecke === 'required' && this._grundstuecke().length === 0) {
      this.addGrundstueck();
    }
  }

  private createFahrzeug(): FahrzeugRuntime {
    return new FahrzeugRuntime(
      {
        auth: this.env.auth,
        arb: () => this.env.vertragValue<number>('arb'),
        deckungRisikoart: () => this.risikoartValue(),
      },
      this.injector,
    );
  }
  addFahrzeug(): void {
    const fz = this.createFahrzeug();
    fz.initialize();
    this._fahrzeuge.update((l) => [...l, fz]);
  }
  removeFahrzeug(fz: FahrzeugRuntime): void {
    if (this._fahrzeuge().length <= 1 && this.capacity().fahrzeuge === 'required') {
      return;
    }
    this._fahrzeuge.update((l) => l.filter((x) => x !== fz));
  }
  readonly canRemoveFahrzeug = computed(
    () => this._fahrzeuge().length > 1 || this.capacity().fahrzeuge !== 'required',
  );

  private createGrundstueck(): GrundstueckRuntime {
    return new GrundstueckRuntime(
      { auth: this.env.auth, deckungRisikoart: () => this.risikoartValue() },
      this.injector,
    );
  }
  addGrundstueck(): void {
    const gr = this.createGrundstueck();
    gr.initialize();
    this._grundstuecke.update((l) => [...l, gr]);
  }
  removeGrundstueck(gr: GrundstueckRuntime): void {
    if (this._grundstuecke().length <= 1 && this.capacity().grundstuecke === 'required') {
      return;
    }
    this._grundstuecke.update((l) => l.filter((x) => x !== gr));
  }
  readonly canRemoveGrundstueck = computed(
    () => this._grundstuecke().length > 1 || this.capacity().grundstuecke !== 'required',
  );

  // --- Gültigkeit / Payload -----------------------------------------------
  readonly valid = computed(() => {
    const fieldsOk = this.fields.allFields().every((f) => f.gueltig());
    const c = capacity(this.risikoartValue());

    const fahrzeugeOk =
      c.fahrzeuge === 'required'
        ? this._fahrzeuge().length >= 1 && this._fahrzeuge().every((f) => f.valid())
        : this._fahrzeuge().length === 0;

    const grundstueckeOk =
      c.grundstuecke === 'required'
        ? this._grundstuecke().length >= 1 && this._grundstuecke().every((g) => g.valid())
        : this._grundstuecke().length === 0;

    return fieldsOk && fahrzeugeOk && grundstueckeOk;
  });

  payload(): DeckungValues {
    return {
      risikoart: this.risikoartValue(),
      rabatt: this.fields.field<number>('rabatt').value(),
      zuschlag: this.fields.field<number>('zuschlag').value(),
      fahrzeuge: this._fahrzeuge().map((f) => f.payload()),
      grundstuecke: this._grundstuecke().map((g) => g.payload()),
    };
  }
}
