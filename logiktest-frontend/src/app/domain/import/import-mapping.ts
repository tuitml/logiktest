import type { BackendDeckung, BackendVorbelegung } from '../../core/backend/import.service';
import type { VertragsdatenFeldId } from '../fields/vertragsdaten.kontext';
import type {
  Berufsklasse,
  Lebenssituation,
  Preisstand,
  SbStaffel,
  Tarifgruppe,
} from '../fields/vertragsdaten.typen';
import type { Versicherer } from '../versicherer';
import type { RisikoartId, Wagniskennziffer } from '../deckungen/deckung.typen';
import type {
  ImportDeckung,
  ImportErgebnis,
  ImportGrundstueck,
} from './import.model';

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

const WAGNISKENNZIFFER: Record<string, Wagniskennziffer> = {
  KRAFTRAEDER_MIT_ZULASSUNG: 'KRAFTRAEDER_MIT_ZULASSUNG',
  OMNIBUSSE_UEBER_9_SITZE: 'OMNIBUSSE_UEBER_9_SITZE',
  ZUGMASCHINEN: 'ZUGMASCHINEN',
};

/* ---------------------------------------------------------------------------
 * kleine Wert-Helfer
 * ------------------------------------------------------------------------- */
function alsText(wert: unknown): string | undefined {
  if (typeof wert === 'string') {
    return wert.trim() === '' ? undefined : wert.trim();
  }
  if (typeof wert === 'number' && !Number.isNaN(wert)) {
    return String(wert);
  }
  return undefined;
}

function alsZahl(wert: unknown): number | undefined {
  if (typeof wert === 'number') {
    return Number.isNaN(wert) ? undefined : wert;
  }
  if (typeof wert === 'string' && wert.trim() !== '' && !Number.isNaN(Number(wert))) {
    return Number(wert);
  }
  return undefined;
}

function nachSchluessel<T>(tabelle: Record<string, T>, wert: unknown): T | undefined {
  const schluessel = alsText(wert);
  return schluessel ? tabelle[schluessel] : undefined;
}

function alsSbStaffel(wert: unknown): SbStaffel | undefined {
  const roh = typeof wert === 'string' ? wert.replace(/^SB/i, '') : wert;
  const zahl = alsZahl(roh);
  return zahl === 150 || zahl === 250 || zahl === 300 ? zahl : undefined;
}

function alsRisikoart(wert: unknown): RisikoartId | undefined {
  const text = alsText(wert);
  return text ? text.replace(/^RA_?/i, '') || undefined : undefined;
}

/* ---------------------------------------------------------------------------
 * DAS Mapping: pro App-Feld genau ein Eintrag.
 * Neues Feld -> hier eine Zeile ergänzen, sonst nichts.
 * ------------------------------------------------------------------------- */
type Mapper = (roh: BackendVorbelegung) => unknown;

const VERTRAGSDATEN_MAPPING: Record<VertragsdatenFeldId, Mapper> = {
  versicherer: (r) => nachSchluessel(VERSICHERER, r['mandant']),
  tarif: (r) => alsText(r['tarif']),
  arb: (r) => alsZahl(r['arb']),
  tarifgruppe: (r) => nachSchluessel(TARIFGRUPPE, r['tarifgruppe']),
  postleitzahl: (r) => alsText(r['postleitzahl']),
  sbStaffel: (r) => alsSbStaffel(r['sbStaffel']),
  berufsklasse: (r) => nachSchluessel(BERUFSKLASSE, r['berufsklasse']),
  lebenssituation: (r) => nachSchluessel(LEBENSSITUATION, r['lebenssituation']),
  preisstand: (r) => nachSchluessel(PREISSTAND, r['preisformelId']),
};

/**
 * Übersetzt eine Backend-Vorbelegung in App-Werte. Unbekannte Backend-Felder
 * werden ignoriert; App-Felder ohne verwertbaren Wert bleiben unbelegt
 * (undefined -> nicht im Ergebnis).
 */
export function mappeVorbelegung(roh: BackendVorbelegung): ImportErgebnis {
  const vertragsdaten: Partial<Record<VertragsdatenFeldId, unknown>> = {};
  for (const [feldId, mapper] of Object.entries(VERTRAGSDATEN_MAPPING) as Array<
    [VertragsdatenFeldId, Mapper]
  >) {
    const wert = mapper(roh);
    if (wert !== undefined) {
      vertragsdaten[feldId] = wert;
    }
  }

  return {
    vertragsdaten,
    deckungen: (roh.deckungen ?? []).map(mappeDeckung),
  };
}

function mappeDeckung(d: BackendDeckung): ImportDeckung {
  return {
    risikoart: alsRisikoart(d['risikoart']),
    rabatt: alsZahl(d['rabatt']),
    zuschlag: alsZahl(d['zuschlag']),
    fahrzeuge: (d.fahrzeuge ?? []).map((f) => ({
      wagniskennziffer: nachSchluessel(WAGNISKENNZIFFER, f['wagniskennziffer']),
    })),
    grundstuecke: (d.grundstuecke ?? []).map(mappeGrundstueck),
  };
}

function mappeGrundstueck(g: Record<string, unknown>): ImportGrundstueck {
  const nutzungen = (g['nutzungen'] as ReadonlyArray<Record<string, unknown>> | undefined) ?? [];
  return {
    nutzungen: nutzungen.map((n) => ({
      nutzungsart: alsText(n['nutzungsart']),
      wert: alsZahl(n['wert']),
    })),
  };
}
