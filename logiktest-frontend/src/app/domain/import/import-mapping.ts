import type { BackendDeckung, BackendPrefill } from '../../core/backend/import.service';
import type { VertragsdatenFieldId } from '../fields/vertragsdaten.context';
import type {
  Berufsklasse,
  Lebenssituation,
  Preisstand,
  SbStaffel,
  Tarifgruppe,
   Zahlungsart,
} from '../fields/vertragsdaten.types';
import type { Versicherer } from '../versicherer';
import type { RisikoartId, Wagniskennziffer } from '../deckungen/deckung.types';
import type { ImportDeckung, ImportGrundstueck, ImportResult } from './import.model';

/* ---------------------------------------------------------------------------
 * Wert-Übersetzungen Backend-Code -> App-Enum
 * ------------------------------------------------------------------------- */
const VERSICHERER: Record<string, Versicherer> = {
  HCR: 'HCR',
  HUK24: 'HUK24',
  VRK: 'VRK',
};

const TARIFGRUPPE: Record<string, Tarifgruppe> = {
  NICHT_OEFFENTLICHER_DIENST: 'NICHT_OED',
  OEFFENTLICHER_DIENST: 'OED',
  SELBSTSTAENDIG: 'SELBSTSTAENDIG',
  SELBSTAENDIG: 'SELBSTSTAENDIG',
};

const BERUFSKLASSE: Record<string, Berufsklasse> = {
  KEINE: 'KEINE',
  KEINE_BERUFSKLASSE: 'KEINE',
  MITARBEITER_SOZIALE_EINRICHTUNGEN: 'MITARBEITER_SOZIALE_EINRICHTUNGEN',
  MITARBEITER_SOZIALER_EINRICHTUNGEN: 'MITARBEITER_SOZIALE_EINRICHTUNGEN',
};

const LEBENSSITUATION: Record<string, Lebenssituation> = {
  SINGLE: 'SINGLE',
  SINGLE_MIT_KINDERN: 'SINGLE_MIT_KINDERN',
  PAAR_OHNE_KINDER: 'PAAR_OHNE_KINDER',
  FAMILIE_MIT_KINDERN: 'FAMILIE_MIT_KINDERN',
  UNBEKANNT: 'UNBEKANNT',
  // "KEINE_AUSWAHL" bewusst ohne Eintrag -> undefined
};

const PREISSTAND: Record<string, Preisstand> = {
  '20251001_ARB2025': '20251001_ARB2025',
  '20261001_ARB2026': '20261001_ARB2026',
};

const ZAHLUNGSART: Record<string, Zahlungsart> = {
  UEBERWEISUNG: 'UEBERWEISUNG',
  LASTSCHRIFT: 'LASTSCHRIFTEINZUG',
  LASTSCHRIFTEINZUG: 'LASTSCHRIFTEINZUG',
  // "KEINE_ANGABE" bewusst ohne Eintrag -> undefined
};

const WAGNISKENNZIFFER: Record<string, Wagniskennziffer> = {
  KRAFTRAEDER_MIT_ZULASSUNG: 'KRAFTRAEDER_MIT_ZULASSUNG',
  OMNIBUSSE_UEBER_9_SITZE: 'OMNIBUSSE_UEBER_9_SITZE',
  ZUGMASCHINEN: 'ZUGMASCHINEN',
};

/* ---------------------------------------------------------------------------
 * kleine Wert-Helfer
 * ------------------------------------------------------------------------- */
function asText(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value.trim() === '' ? undefined : value.trim();
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return String(value);
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function byKey<T>(table: Record<string, T>, value: unknown): T | undefined {
  const key = asText(value);
  return key ? table[key] : undefined;
}

function asSbStaffel(value: unknown): SbStaffel | undefined {
  const raw = typeof value === 'string' ? value.replace(/^SB/i, '') : value;
  const n = asNumber(raw);
  return n === 150 || n === 250 || n === 300 ? n : undefined;
}

function asRisikoart(value: unknown): RisikoartId | undefined {
  const text = asText(value);
  return text ? text.replace(/^RA_?/i, '') || undefined : undefined;
}

/* ---------------------------------------------------------------------------
 * DAS Mapping: pro App-Feld genau ein Eintrag.
 * Neues Feld -> hier eine Zeile ergänzen, sonst nichts.
 * ------------------------------------------------------------------------- */
type Mapper = (raw: BackendPrefill) => unknown;

const VERTRAGSDATEN_MAPPING: Record<VertragsdatenFieldId, Mapper> = {
  versicherer: (r) => byKey(VERSICHERER, r['mandant']),
  tarif: (r) => asText(r['tarif']),
  arb: (r) => asNumber(r['arb']),
  tarifgruppe: (r) => byKey(TARIFGRUPPE, r['tarifgruppe']),
  postleitzahl: (r) => asText(r['postleitzahl']),
  sbStaffel: (r) => asSbStaffel(r['sbStaffel']),
  berufsklasse: (r) => byKey(BERUFSKLASSE, r['berufsklasse']),
  lebenssituation: (r) => byKey(LEBENSSITUATION, r['lebenssituation']),
  preisstand: (r) => byKey(PREISSTAND, r['preisformelId']),
  zahlungsart: (r) => byKey(ZAHLUNGSART, r['zahlungsart']),
};

/**
 * Übersetzt eine Backend-Vorbelegung in App-Werte. Unbekannte Backend-Felder
 * werden ignoriert; App-Felder ohne verwertbaren Wert bleiben unbelegt
 * (undefined -> nicht im Ergebnis).
 */
export function mapPrefill(raw: BackendPrefill): ImportResult {
  const vertragsdaten: Partial<Record<VertragsdatenFieldId, unknown>> = {};
  for (const [fieldId, mapper] of Object.entries(VERTRAGSDATEN_MAPPING) as Array<
    [VertragsdatenFieldId, Mapper]
  >) {
    const value = mapper(raw);
    if (value !== undefined) {
      vertragsdaten[fieldId] = value;
    }
  }

  return {
    vertragsdaten,
    deckungen: (raw.deckungen ?? []).map(mapDeckung),
  };
}

function mapDeckung(d: BackendDeckung): ImportDeckung {
  return {
    risikoart: asRisikoart(d['risikoart']),
    rabatt: asNumber(d['rabatt']),
    zuschlag: asNumber(d['zuschlag']),
    fahrzeuge: (d.fahrzeuge ?? []).map((f) => ({
      wagniskennziffer: byKey(WAGNISKENNZIFFER, f['wagniskennziffer']),
    })),
    grundstuecke: (d.grundstuecke ?? []).map(mapGrundstueck),
  };
}

function mapGrundstueck(g: Record<string, unknown>): ImportGrundstueck {
  const nutzungen = (g['nutzungen'] as ReadonlyArray<Record<string, unknown>> | undefined) ?? [];
  return {
    nutzungen: nutzungen.map((n) => ({
      nutzungsart: asText(n['nutzungsart']),
      wert: asNumber(n['wert']),
    })),
  };
}
