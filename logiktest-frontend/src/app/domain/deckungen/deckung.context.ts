import type { AuthReader, FieldId, FieldReader, RuleContext } from '../../core/engine';
import { NO_SERVICES } from '../../core/engine';
import type { FieldStore } from '../../core/engine';
import type { RisikoartId } from './deckung.types';

/** Kontext für die Deckungs-Felder (risikoart, rabatt, zuschlag). */
export interface DeckungContext extends RuleContext {
  ownRisikoart(): RisikoartId | undefined;
  otherRisikoarten(): ReadonlyArray<RisikoartId>;
}

/** Kontext für das Fahrzeug-Feld Wagniskennziffer. */
export interface FahrzeugContext extends RuleContext {
  arb(): number | undefined;
  deckungRisikoart(): RisikoartId | undefined;
}

/** Kontext für die Nutzungs-Felder nutzungsart und wert. */
export interface NutzungContext extends RuleContext {
  deckungRisikoart(): RisikoartId | undefined;
  nutzungsart(): string | undefined;
}

/** Baut aus einem lokalen FieldStore eine minimale `field()`-Sicht (nur eigene Felder). */
function localFieldReader<K extends RuleContext>(store: FieldStore<K>): (id: FieldId) => FieldReader {
  return (id) => {
    const rt = store.field(id);
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
  };
}

export interface DeckungEnv {
  readonly auth: AuthReader;
  vertragValue<T = unknown>(id: FieldId): T | undefined;
  otherRisikoarten(): ReadonlyArray<RisikoartId>;
}

export function buildDeckungContext(
  store: FieldStore<DeckungContext>,
  env: DeckungEnv,
): DeckungContext {
  return {
    value: <T>(id: FieldId) =>
      store.hasField(id) ? store.field<T>(id).value() : env.vertragValue<T>(id),
    field: localFieldReader(store),
    auth: env.auth,
    services: NO_SERVICES,
    ownRisikoart: () => store.field<RisikoartId>('risikoart').value(),
    otherRisikoarten: () => env.otherRisikoarten(),
  };
}

export interface FahrzeugEnv {
  readonly auth: AuthReader;
  arb(): number | undefined;
  deckungRisikoart(): RisikoartId | undefined;
}

export function buildFahrzeugContext(
  store: FieldStore<FahrzeugContext>,
  env: FahrzeugEnv,
): FahrzeugContext {
  return {
    value: <T>(id: FieldId) => store.field<T>(id).value(),
    field: localFieldReader(store),
    auth: env.auth,
    services: NO_SERVICES,
    arb: () => env.arb(),
    deckungRisikoart: () => env.deckungRisikoart(),
  };
}

export interface NutzungEnv {
  readonly auth: AuthReader;
  deckungRisikoart(): RisikoartId | undefined;
}

export function buildNutzungContext(
  store: FieldStore<NutzungContext>,
  env: NutzungEnv,
): NutzungContext {
  return {
    value: <T>(id: FieldId) => store.field<T>(id).value(),
    field: localFieldReader(store),
    auth: env.auth,
    services: NO_SERVICES,
    deckungRisikoart: () => env.deckungRisikoart(),
    nutzungsart: () => store.field<string>('nutzungsart').value(),
  };
}
