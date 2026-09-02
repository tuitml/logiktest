/**
 * Sehr einfaches Logging der Engine: zeigt, welche Logik gelaufen ist und
 * welcher Wert gesetzt wurde.
 *
 * Umschalten zur Laufzeit (z. B. in der Browser-Konsole):
 *   regelLog.aktiv = false          // alles aus
 *   regelLog.verbose = true         // auch "behalten" + steuerung/wertebereich
 *
 * In `main.ts` wird `regelLog` auf `globalThis` gelegt.
 */
export interface RegelLogEinstellungen {
  aktiv: boolean;
  verbose: boolean;
}

export const regelLog: RegelLogEinstellungen = {
  aktiv: true,
  verbose: false,
};

export function setzeRegelLog(teil: Partial<RegelLogEinstellungen>): void {
  Object.assign(regelLog, teil);
}

/** Wert lesbar formatieren. */
export function fmtWert(wert: unknown): string {
  if (wert === undefined) return 'undefined';
  if (wert === null) return 'null';
  if (typeof wert === 'string') return `"${wert}"`;
  if (typeof wert === 'object') {
    try {
      return JSON.stringify(wert);
    } catch {
      return String(wert);
    }
  }
  return String(wert);
}

function zeile(store: string, text: string): string {
  return `[Regel:${store}] ${text}`;
}

export const log = {
  init(store: string): void {
    if (!regelLog.aktiv) return;
    console.debug(zeile(store, 'initialisieren'));
  },

  benutzerAenderung(store: string, feldId: string, wert: unknown): void {
    if (!regelLog.aktiv) return;
    console.debug(zeile(store, `benutzerAenderung  ${feldId} = ${fmtWert(wert)}`));
  },

  importiert(store: string, werte: Readonly<Record<string, unknown>>): void {
    if (!regelLog.aktiv) return;
    const paare = Object.entries(werte)
      .map(([id, w]) => `${id}=${fmtWert(w)}`)
      .join(', ');
    console.debug(zeile(store, `import (ohne Regel-Durchlauf): ${paare}`));
  },

  /**
   * @param zeilen  bereits formatierte Änderungszeilen der Datenmanipulation
   */
  propagieren(store: string, grund: string, runden: number, zeilen: string[]): void {
    if (!regelLog.aktiv) return;
    if (zeilen.length === 0 && !regelLog.verbose) return;

    console.debug(
      zeile(
        store,
        `datenmanipulation — ${grund}  (${zeilen.length} Änderung(en), ${runden} Runde(n))`,
      ),
    );
    for (const z of zeilen) {
      console.debug(zeile(store, `  ${z}`));
    }
  },

  steuerung(
    store: string,
    feldId: string,
    s: { sichtbar: boolean; bearbeitbar: boolean; relevant: boolean },
  ): void {
    if (!regelLog.aktiv || !regelLog.verbose) return;
    console.debug(
      zeile(
        store,
        `steuerung  ${feldId}: sichtbar=${s.sichtbar} bearbeitbar=${s.bearbeitbar} relevant=${s.relevant}`,
      ),
    );
  },

  wertebereich(store: string, feldId: string, anzahl: number): void {
    if (!regelLog.aktiv || !regelLog.verbose) return;
    console.debug(zeile(store, `wertebereich  ${feldId}: ${anzahl} Option(en)`));
  },
};
