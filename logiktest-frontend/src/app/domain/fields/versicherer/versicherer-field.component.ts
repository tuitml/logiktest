import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DeckungStore } from '../../deckungen/deckung.store';
import { SelectFieldComponent } from '../../../features/ui/select-field.component';
import { SELECT_FIELD_TEMPLATE, VertragsdatenFieldBase } from '../../../features/ui/vertragsdaten-field.base';

/**
 * Das Feld "Versicherer" gehört zu keinem Tab – es steht in der Kopfzeile der
 * Anwendung. Technisch ist es ein normales Feld im selben Store, hat aber eine
 * Sonderregel: ändert der Benutzer den Versicherer, werden ALLE Deckungen
 * verworfen und der Deckungs-Tab startet neu mit genau einer Default-Deckung.
 */
@Component({
  selector: 'app-versicherer-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFieldComponent],
  template: SELECT_FIELD_TEMPLATE,
})
export class VersichererFieldComponent extends VertragsdatenFieldBase {
  protected readonly fieldId = 'versicherer';
  private readonly deckungen = inject(DeckungStore);

  protected override change(value: unknown): void {
    const before = this.runtime.value();
    super.change(value);
    if (this.runtime.value() !== before) {
      this.deckungen.initialize();
    }
  }
}
