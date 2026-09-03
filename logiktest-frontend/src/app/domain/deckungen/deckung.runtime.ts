import { computed, Injector, signal, type Signal } from '@angular/core';

import { FeldStore } from '../../core/engine';
import type { AuthLese, FeldId, FeldView } from '../../core/engine';
import {
  baueDeckungKontext,
  baueFahrzeugKontext,
  baueNutzungKontext,
  type DeckungKontext,
  type FahrzeugKontext,
  type NutzungKontext,
} from './deckung.kontext';
import { DECKUNG_FELDER } from './deckung.felder';
import { FAHRZEUG_FELDER } from './fahrzeug/wagniskennziffer.feld';
import { NUTZUNG_FELDER } from './grundstueck/nutzung.felder';
import { kapazitaet, type DeckungsKapazitaet } from './kapazitaet';
import type {
  DeckungWerte,
  FahrzeugWerte,
  GrundstueckWerte,
  NutzungWerte,
  RisikoartId,
  Wagniskennziffer,
} from './deckung.typen';
import type {
  ImportDeckung,
  ImportFahrzeug,
  ImportGrundstueck,
  ImportNutzung,
} from '../import/import.model';

let laufendeId = 0;
const neueId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${++laufendeId}`;

/* ----------------------------------------------------------------------------
 * Nutzung
 * ------------------------------------------------------------------------- */
export class NutzungRuntime {
  readonly id = neueId();
  private readonly felder: FeldStore<NutzungKontext>;

  constructor(
    umgebung: { auth: AuthLese; risikoartDerDeckung: () => RisikoartId | undefined },
    injector: Injector,
    name = 'nutzung',
  ) {
    this.felder = new FeldStore<NutzungKontext>(
      name,
      NUTZUNG_FELDER,
      (s) => baueNutzungKontext(s, umgebung),
      injector,
    );
  }

  initialisieren(): void {
    this.felder.initialisieren();
  }

  /** Import: Werte übernehmen, OHNE Regeln laufen zu lassen. */
  importieren(daten: ImportNutzung): void {
    this.felder.importieren({ nutzungsart: daten.nutzungsart, wert: daten.wert });
  }

  nutzungsartView(): FeldView {
    return this.felder.feld('nutzungsart').view();
  }
  wertView(): FeldView {
    return this.felder.feld('wert').view();
  }
  nutzungsartWert(): string | undefined {
    return this.felder.feld<string>('nutzungsart').rohWert();
  }

  setzeNutzungsart(wert: string | undefined): void {
    const vorher = this.nutzungsartWert();
    this.felder.benutzerAenderung('nutzungsart', wert);
    if (vorher !== wert) {
      // Nutzungsart gewechselt -> Wert zurücksetzen
      this.felder.benutzerAenderung('wert', undefined);
    }
  }
  setzeWert(wert: number | undefined): void {
    this.felder.benutzerAenderung('wert', wert);
  }

  readonly gueltig = computed(
    () =>
      this.felder.feld('nutzungsart').gueltig() && this.felder.feld('wert').gueltig(),
  );

  payload(): NutzungWerte {
    return {
      nutzungsart: this.nutzungsartWert(),
      wert: this.felder.feld<number>('wert').rohWert(),
    };
  }
}

/* ----------------------------------------------------------------------------
 * Grundstück
 * ------------------------------------------------------------------------- */
export class GrundstueckRuntime {
  readonly id = neueId();
  private readonly _nutzungen = signal<ReadonlyArray<NutzungRuntime>>([]);
  readonly nutzungen = this._nutzungen.asReadonly();

  constructor(
    private readonly umgebung: {
      auth: AuthLese;
      risikoartDerDeckung: () => RisikoartId | undefined;
    },
    private readonly injector: Injector,
    private readonly name = 'grundstueck',
  ) {}

  initialisieren(): void {
    this._nutzungen.set([]);
    this.nutzungHinzufuegen();
  }

  /** Import: exakt die übergebenen Nutzungen (keine Min-1-Regel, kein Regel-Durchlauf). */
  importieren(daten: ImportGrundstueck): void {
    this._nutzungen.set(
      daten.nutzungen.map((n, i) => {
        const nr = this.erzeugeNutzung(i + 1);
        nr.importieren(n);
        return nr;
      }),
    );
  }

  private erzeugeNutzung(nr: number): NutzungRuntime {
    return new NutzungRuntime(this.umgebung, this.injector, `${this.name}/nutzung#${nr}`);
  }

  nutzungHinzufuegen(): void {
    const n = this.erzeugeNutzung(this._nutzungen().length + 1);
    n.initialisieren();
    this._nutzungen.update((l) => [...l, n]);
  }
  nutzungEntfernen(n: NutzungRuntime): void {
    if (this._nutzungen().length <= 1) {
      return;
    }
    this._nutzungen.update((l) => l.filter((x) => x !== n));
  }
  readonly darfNutzungEntfernen = computed(() => this._nutzungen().length > 1);

  readonly gueltig = computed(
    () => this._nutzungen().length >= 1 && this._nutzungen().every((n) => n.gueltig()),
  );

  payload(): GrundstueckWerte {
    return { nutzungen: this._nutzungen().map((n) => n.payload()) };
  }
}

/* ----------------------------------------------------------------------------
 * Fahrzeug
 * ------------------------------------------------------------------------- */
export class FahrzeugRuntime {
  readonly id = neueId();
  private readonly felder: FeldStore<FahrzeugKontext>;

  constructor(
    umgebung: {
      auth: AuthLese;
      arb: () => number | undefined;
      risikoartDerDeckung: () => RisikoartId | undefined;
    },
    injector: Injector,
    name = 'fahrzeug',
  ) {
    this.felder = new FeldStore<FahrzeugKontext>(
      name,
      FAHRZEUG_FELDER,
      (s) => baueFahrzeugKontext(s, umgebung),
      injector,
    );
  }

  initialisieren(): void {
    this.felder.initialisieren();
  }
  regelnAnwenden(): void {
    this.felder.regelnAnwenden();
  }

  /** Import: Wert übernehmen, OHNE Regeln laufen zu lassen. */
  importieren(daten: ImportFahrzeug): void {
    this.felder.importieren({ wagniskennziffer: daten.wagniskennziffer });
  }

  wagniskennzifferView(): FeldView {
    return this.felder.feld('wagniskennziffer').view();
  }

  setzeWagniskennziffer(wert: Wagniskennziffer | undefined): void {
    this.felder.benutzerAenderung('wagniskennziffer', wert);
  }

  readonly gueltig = computed(() => this.felder.feld('wagniskennziffer').gueltig());

  payload(): FahrzeugWerte {
    return { wagniskennziffer: this.felder.feld<Wagniskennziffer>('wagniskennziffer').rohWert() };
  }
}

/* ----------------------------------------------------------------------------
 * Deckung
 * ------------------------------------------------------------------------- */
export interface DeckungUmgebungExtern {
  readonly auth: AuthLese;
  vertragsWert<T = unknown>(id: FeldId): T | undefined;
  andereRisikoarten(selbst: DeckungRuntime): ReadonlyArray<RisikoartId>;
}

export class DeckungRuntime {
  readonly id = neueId();
  private readonly felder: FeldStore<DeckungKontext>;
  private readonly _fahrzeuge = signal<ReadonlyArray<FahrzeugRuntime>>([]);
  private readonly _grundstuecke = signal<ReadonlyArray<GrundstueckRuntime>>([]);
  readonly fahrzeuge = this._fahrzeuge.asReadonly();
  readonly grundstuecke = this._grundstuecke.asReadonly();

  constructor(
    private readonly umgebung: DeckungUmgebungExtern,
    private readonly injector: Injector,
    private readonly name = 'deckung',
  ) {
    this.felder = new FeldStore<DeckungKontext>(
      this.name,
      DECKUNG_FELDER,
      (s) =>
        baueDeckungKontext(s, {
          auth: umgebung.auth,
          vertragsWert: (id) => umgebung.vertragsWert(id),
          andereRisikoarten: () => umgebung.andereRisikoarten(this),
        }),
      injector,
    );
  }

  initialisieren(): void {
    this.felder.initialisieren();
    this.synchronisiereKinder();
  }

  /**
   * Import: Risikoart/Rabatt/Zuschlag + Fahrzeuge/Grundstücke exakt übernehmen,
   * OHNE Regeln (kein `synchronisiereKinder`, keine Datenmanipulation).
   */
  importieren(daten: ImportDeckung): void {
    this.felder.importieren({
      risikoart: daten.risikoart,
      rabatt: daten.rabatt,
      zuschlag: daten.zuschlag,
    });
    this._fahrzeuge.set(
      daten.fahrzeuge.map((f, i) => {
        const fz = this.erzeugeFahrzeug(i + 1);
        fz.importieren(f);
        return fz;
      }),
    );
    this._grundstuecke.set(
      daten.grundstuecke.map((g, i) => {
        const gr = this.erzeugeGrundstueck(i + 1);
        gr.importieren(g);
        return gr;
      }),
    );
  }

  /** Regeln nach einer Änderung an einer Nachbar-Deckung neu bewerten. */
  regelnAnwenden(): void {
    this.felder.regelnAnwenden();
    this.synchronisiereKinder();
    this._fahrzeuge().forEach((f) => f.regelnAnwenden());
  }

  // --- Felder -------------------------------------------------------------
  risikoartWert(): RisikoartId | undefined {
    return this.felder.feld<RisikoartId>('risikoart').rohWert();
  }
  risikoartView(): FeldView {
    return this.felder.feld('risikoart').view();
  }
  rabattView(): FeldView {
    return this.felder.feld('rabatt').view();
  }
  zuschlagView(): FeldView {
    return this.felder.feld('zuschlag').view();
  }

  setzeFeld(id: FeldId, wert: unknown): void {
    const risikoartVorher = this.risikoartWert();
    this.felder.benutzerAenderung(id, wert);
    if (id === 'risikoart' && risikoartVorher !== this.risikoartWert()) {
      // Risikoart gewechselt -> alle Fahrzeuge und Grundstücke entfernen
      this._fahrzeuge.set([]);
      this._grundstuecke.set([]);
      this.synchronisiereKinder();
    }
  }

  // --- Kapazität / Kinder ----------------------------------------------------
  readonly kapazitaet: Signal<DeckungsKapazitaet> = computed(() =>
    kapazitaet(this.risikoartWert()),
  );

  private synchronisiereKinder(): void {
    const k = kapazitaet(this.risikoartWert());

    if (k.fahrzeuge === 'keine' && this._fahrzeuge().length > 0) {
      this._fahrzeuge.set([]);
    }
    if (k.fahrzeuge === 'pflicht' && this._fahrzeuge().length === 0) {
      this.fahrzeugHinzufuegen();
    }
    if (k.grundstuecke === 'keine' && this._grundstuecke().length > 0) {
      this._grundstuecke.set([]);
    }
    if (k.grundstuecke === 'pflicht' && this._grundstuecke().length === 0) {
      this.grundstueckHinzufuegen();
    }
  }

  private erzeugeFahrzeug(nr: number): FahrzeugRuntime {
    return new FahrzeugRuntime(
      {
        auth: this.umgebung.auth,
        arb: () => this.umgebung.vertragsWert<number>('arb'),
        risikoartDerDeckung: () => this.risikoartWert(),
      },
      this.injector,
      `${this.name}/fahrzeug#${nr}`,
    );
  }

  fahrzeugHinzufuegen(): void {
    const fz = this.erzeugeFahrzeug(this._fahrzeuge().length + 1);
    fz.initialisieren();
    this._fahrzeuge.update((l) => [...l, fz]);
  }
  fahrzeugEntfernen(fz: FahrzeugRuntime): void {
    if (this._fahrzeuge().length <= 1 && this.kapazitaet().fahrzeuge === 'pflicht') {
      return;
    }
    this._fahrzeuge.update((l) => l.filter((x) => x !== fz));
  }
  readonly darfFahrzeugEntfernen = computed(
    () => this._fahrzeuge().length > 1 || this.kapazitaet().fahrzeuge !== 'pflicht',
  );

  private erzeugeGrundstueck(nr: number): GrundstueckRuntime {
    return new GrundstueckRuntime(
      { auth: this.umgebung.auth, risikoartDerDeckung: () => this.risikoartWert() },
      this.injector,
      `${this.name}/grundstueck#${nr}`,
    );
  }

  grundstueckHinzufuegen(): void {
    const gr = this.erzeugeGrundstueck(this._grundstuecke().length + 1);
    gr.initialisieren();
    this._grundstuecke.update((l) => [...l, gr]);
  }
  grundstueckEntfernen(gr: GrundstueckRuntime): void {
    if (this._grundstuecke().length <= 1 && this.kapazitaet().grundstuecke === 'pflicht') {
      return;
    }
    this._grundstuecke.update((l) => l.filter((x) => x !== gr));
  }
  readonly darfGrundstueckEntfernen = computed(
    () => this._grundstuecke().length > 1 || this.kapazitaet().grundstuecke !== 'pflicht',
  );

  // --- Gültigkeit / Payload -----------------------------------------------
  readonly gueltig = computed(() => {
    const felderOk = this.felder.alleFelder().every((f) => f.gueltig());
    const k = kapazitaet(this.risikoartWert());

    const fahrzeugeOk =
      k.fahrzeuge === 'pflicht'
        ? this._fahrzeuge().length >= 1 && this._fahrzeuge().every((f) => f.gueltig())
        : this._fahrzeuge().length === 0;

    const grundstueckeOk =
      k.grundstuecke === 'pflicht'
        ? this._grundstuecke().length >= 1 && this._grundstuecke().every((g) => g.gueltig())
        : this._grundstuecke().length === 0;

    return felderOk && fahrzeugeOk && grundstueckeOk;
  });

  payload(): DeckungWerte {
    return {
      risikoart: this.risikoartWert(),
      rabatt: this.felder.feld<number>('rabatt').rohWert(),
      zuschlag: this.felder.feld<number>('zuschlag').rohWert(),
      fahrzeuge: this._fahrzeuge().map((f) => f.payload()),
      grundstuecke: this._grundstuecke().map((g) => g.payload()),
    };
  }
}
