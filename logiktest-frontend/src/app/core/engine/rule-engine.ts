import { KEEP } from './field.model';
import type { FieldId } from './field.model';
import type { FieldModule } from './field-module';
import type { FieldRuntime } from './field-runtime';
import type { RuleContext } from './rule-context';
import { equal } from './equal';

/**
 * Führt die Datenmanipulation aus – der einzige imperative Teil der Engine.
 *
 * Ablauf `propagate()`:
 *   - iteriert die Felder in topologischer Reihenfolge (Abhängigkeit zuerst)
 *   - jedes Feld darf seinen eigenen Wert setzen (oder KEEP)
 *   - wiederholt bis sich nichts mehr ändert (Fixpunkt), max. `maxIter` Runden
 *
 * Wird NUR nach einer Benutzeränderung bzw. bei `initialize()` aufgerufen –
 * niemals beim Import. Dadurch überschreiben Regeln importierte Werte nicht.
 */
export class RuleEngine<K extends RuleContext = RuleContext> {
  private readonly order: ReadonlyArray<FieldId>;

  constructor(
    private readonly modules: ReadonlyMap<FieldId, FieldModule<unknown, K>>,
    private readonly runtime: (id: FieldId) => FieldRuntime<unknown, K> | undefined,
    private readonly ctx: () => K,
  ) {
    this.order = topoOrder(modules);
  }

  propagate(maxIter = 20): void {
    for (let round = 0; round < maxIter; round++) {
      let changed = false;

      for (const id of this.order) {
        const module = this.modules.get(id);
        const rt = this.runtime(id);
        if (!module?.datenmanipulation || !rt) {
          continue;
        }

        const result = module.datenmanipulation(this.ctx());
        if (result === KEEP) {
          continue;
        }
        if (!equal(result, rt.value())) {
          rt.value.set(result);
          changed = true;
        }
      }

      if (!changed) {
        return;
      }
    }
    console.warn(`[RuleEngine] Fixpunkt nach ${maxIter} Iterationen nicht erreicht.`);
  }
}

function topoOrder<K extends RuleContext>(
  modules: ReadonlyMap<FieldId, FieldModule<unknown, K>>,
): FieldId[] {
  const done = new Set<FieldId>();
  const active = new Set<FieldId>();
  const result: FieldId[] = [];

  const visit = (id: FieldId): void => {
    if (done.has(id) || active.has(id)) {
      return; // fertig oder Zyklus -> Fixpunkt-Iteration übernimmt
    }
    active.add(id);
    for (const dep of modules.get(id)?.dependencies ?? []) {
      if (modules.has(dep)) {
        visit(dep);
      }
    }
    active.delete(id);
    done.add(id);
    result.push(id);
  };

  for (const id of modules.keys()) {
    visit(id);
  }
  return result;
}
