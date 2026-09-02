import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DeckungStore } from '../../deckungen/deckung.store';
import { FeldHostComponent } from '../../../features/ui/feld-host.component';
import { FELD_TEMPLATE, VertragsdatenFeldBasis } from '../../../features/ui/vertragsdaten-feld.basis';

/**
 * Das Feld "Versicherer" gehört zu keinem Tab – es steht in der Kopfzeile der
 * Anwendung. Technisch ist es ein normales Feld im selben Store, hat aber eine
 * Sonderregel: ändert der Benutzer den Versicherer, werden ALLE Deckungen
 * verworfen und der Deckungs-Tab startet neu mit genau einer Default-Deckung
 * (Standard-Risikoart des neuen Versicherers).
 */
@Component({
  selector: 'app-versicherer-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FeldHostComponent],
  template: FELD_TEMPLATE,
})
export class VersichererFieldComponent extends VertragsdatenFeldBasis {
  protected readonly feldId = 'versicherer';
  private readonly deckungen = inject(DeckungStore);

  protected override aendern(wert: unknown): void {
    const vorher = this.rt.rohWert();
    super.aendern(wert); // benutzerAenderung -> Regeln laufen
    if (this.rt.rohWert() !== vorher) {
      this.deckungen.initialisieren();
    }
  }
}
