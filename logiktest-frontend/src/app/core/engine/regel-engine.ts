import { BEHALTEN } from './feld.model';
import type { FeldId } from './feld.model';
import type { FeldModul } from './feld-modul';
import type { FeldRuntime } from './feld-runtime';
import type { RegelKontext } from './regel-kontext';
import { gleich } from './gleichheit';
import { fmtWert, log, regelLog } from './engine-logger';

/**
 * Führt die Datenmanipulation aus – der einzige imperative Teil der Engine.
 *
 * Ablauf `propagieren()`:
 *   - iteriert die Felder in topologischer Reihenfolge (Abhängigkeit zuerst)
 *   - jedes Feld darf seinen eigenen Wert setzen (oder BEHALTEN)
 *   - wiederholt bis sich nichts mehr ändert (Fixpunkt), max. `maxIter` Runden
 *
 * Wird NUR nach einer Benutzeränderung bzw. bei `initialisieren()` aufgerufen –
 * niemals beim Import. Dadurch überschreiben Regeln importierte Werte nicht.
 */
export class RegelEngine<K extends RegelKontext = RegelKontext> {
  private readonly reihenfolge: ReadonlyArray<FeldId>;

  constructor(
    private readonly name: string,
    private readonly module: ReadonlyMap<FeldId, FeldModul<unknown, K>>,
    private readonly runtime: (id: FeldId) => FeldRuntime<unknown, K> | undefined,
    private readonly kontext: () => K,
  ) {
    this.reihenfolge = topologisch(module);
  }

  propagieren(grund: string, maxIter = 20): void {
    const zeilen: string[] = [];
    let runden = 0;

    for (let runde = 0; runde < maxIter; runde++) {
      runden = runde + 1;
      let geaendert = false;

      for (const id of this.reihenfolge) {
        const modul = this.module.get(id);
        const rt = this.runtime(id);
        if (!modul?.datenmanipulation || !rt) {
          continue;
        }

        const ergebnis = modul.datenmanipulation(this.kontext());
        if (ergebnis === BEHALTEN) {
          if (regelLog.verbose) {
            zeilen.push(`${id}.datenmanipulation → behalten (${fmtWert(rt.rohWert())})`);
          }
          continue;
        }
        if (!gleich(ergebnis.wert, rt.rohWert())) {
          zeilen.push(
            `${id}.datenmanipulation: ${fmtWert(rt.rohWert())} → ${fmtWert(ergebnis.wert)}`,
          );
          rt.rohWert.set(ergebnis.wert);
          geaendert = true;
        }
      }

      if (!geaendert) {
        break;
      }
    }

    log.propagieren(this.name, grund, runden, zeilen);

    if (runden >= maxIter) {
      console.warn(`[RegelEngine:${this.name}] Fixpunkt nach ${maxIter} Iterationen nicht erreicht.`);
    }
  }
}

function topologisch<K extends RegelKontext>(
  module: ReadonlyMap<FeldId, FeldModul<unknown, K>>,
): FeldId[] {
  const fertig = new Set<FeldId>();
  const aktiv = new Set<FeldId>();
  const ergebnis: FeldId[] = [];

  const besuche = (id: FeldId): void => {
    if (fertig.has(id) || aktiv.has(id)) {
      return; // fertig oder Zyklus -> Fixpunkt-Iteration übernimmt
    }
    aktiv.add(id);
    for (const dep of module.get(id)?.abhaengigkeiten ?? []) {
      if (module.has(dep)) {
        besuche(dep);
      }
    }
    aktiv.delete(id);
    fertig.add(id);
    ergebnis.push(id);
  };

  for (const id of module.keys()) {
    besuche(id);
  }
  return ergebnis;
}
