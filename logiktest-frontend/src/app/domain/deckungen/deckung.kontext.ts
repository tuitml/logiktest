import type { AuthLese, FeldId, FeldLese, RegelKontext } from '../../core/engine';
import { KEINE_DIENSTE } from '../../core/engine';
import type { FeldStore } from '../../core/engine';
import type { RisikoartId } from './deckung.typen';

/** Kontext für die Deckungs-Felder (risikoart, rabatt, zuschlag). */
export interface DeckungKontext extends RegelKontext {
  risikoartDieserDeckung(): RisikoartId | undefined;
  andereRisikoarten(): ReadonlyArray<RisikoartId>;
}

/** Kontext für das Fahrzeug-Feld Wagniskennziffer. */
export interface FahrzeugKontext extends RegelKontext {
  arb(): number | undefined;
  risikoartDerDeckung(): RisikoartId | undefined;
}

/** Kontext für die Nutzungs-Felder nutzungsart und wert. */
export interface NutzungKontext extends RegelKontext {
  risikoartDerDeckung(): RisikoartId | undefined;
  nutzungsart(): string | undefined;
}

/** Baut aus einem lokalen FeldStore eine minimale `feld()`-Sicht (nur eigene Felder). */
function lokaleFeldSicht<K extends RegelKontext>(store: FeldStore<K>): (id: FeldId) => FeldLese {
  return (id) => {
    const rt = store.feld(id);
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
  };
}

export interface DeckungUmgebung {
  readonly auth: AuthLese;
  vertragsWert<T = unknown>(id: FeldId): T | undefined;
  andereRisikoarten(): ReadonlyArray<RisikoartId>;
}

export function baueDeckungKontext(
  store: FeldStore<DeckungKontext>,
  umgebung: DeckungUmgebung,
): DeckungKontext {
  const feld = lokaleFeldSicht(store);
  return {
    wert: <T>(id: FeldId) => {
      if (store.hatFeld(id)) {
        return store.feld<T>(id).rohWert();
      }
      return umgebung.vertragsWert<T>(id);
    },
    feld,
    auth: umgebung.auth,
    dienste: KEINE_DIENSTE,
    risikoartDieserDeckung: () => store.feld<RisikoartId>('risikoart').rohWert(),
    andereRisikoarten: () => umgebung.andereRisikoarten(),
  };
}

export interface FahrzeugUmgebung {
  readonly auth: AuthLese;
  arb(): number | undefined;
  risikoartDerDeckung(): RisikoartId | undefined;
}

export function baueFahrzeugKontext(
  store: FeldStore<FahrzeugKontext>,
  umgebung: FahrzeugUmgebung,
): FahrzeugKontext {
  return {
    wert: <T>(id: FeldId) => store.feld<T>(id).rohWert(),
    feld: lokaleFeldSicht(store),
    auth: umgebung.auth,
    dienste: KEINE_DIENSTE,
    arb: () => umgebung.arb(),
    risikoartDerDeckung: () => umgebung.risikoartDerDeckung(),
  };
}

export interface NutzungUmgebung {
  readonly auth: AuthLese;
  risikoartDerDeckung(): RisikoartId | undefined;
}

export function baueNutzungKontext(
  store: FeldStore<NutzungKontext>,
  umgebung: NutzungUmgebung,
): NutzungKontext {
  return {
    wert: <T>(id: FeldId) => store.feld<T>(id).rohWert(),
    feld: lokaleFeldSicht(store),
    auth: umgebung.auth,
    dienste: KEINE_DIENSTE,
    risikoartDerDeckung: () => umgebung.risikoartDerDeckung(),
    nutzungsart: () => store.feld<string>('nutzungsart').rohWert(),
  };
}
