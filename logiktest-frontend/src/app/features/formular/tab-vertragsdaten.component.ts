import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TarifFieldComponent } from '../../domain/fields/tarif/tarif-field.component';
import { PostleitzahlFieldComponent } from '../../domain/fields/postleitzahl/postleitzahl-field.component';
import { SbStaffelFieldComponent } from '../../domain/fields/sb-staffel/sb-staffel-field.component';
import { BerufsklasseFieldComponent } from '../../domain/fields/berufsklasse/berufsklasse-field.component';
import { LebenssituationFieldComponent } from '../../domain/fields/lebenssituation/lebenssituation-field.component';
import { PreisstandFieldComponent } from '../../domain/fields/preisstand/preisstand-field.component';

/**
 * Nur Layout: die Feld-Komponenten in einem 2-Spalten-Grid. Unsichtbare Felder
 * rendern nichts (siehe FeldHostComponent) -> nachfolgende Felder rücken auf.
 */
@Component({
  selector: 'app-tab-vertragsdaten',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TarifFieldComponent,
    PostleitzahlFieldComponent,
    SbStaffelFieldComponent,
    BerufsklasseFieldComponent,
    LebenssituationFieldComponent,
    PreisstandFieldComponent,
  ],
  template: `
    <h2 class="tab-ueberschrift">Vertragsdaten</h2>
    <div class="feld-grid">
      <app-tarif-field />
      <app-postleitzahl-field />
      <app-sb-staffel-field />
      <app-berufsklasse-field />
      <app-lebenssituation-field />
      <app-preisstand-field />
    </div>
  `,
})
export class TabVertragsdatenComponent {}
