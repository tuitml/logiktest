import { gleich } from '../../../core/engine';
import type { FeldView, SelectOption } from '../../../core/engine';

/**
 * Native Web Component für Auswahlfelder.
 *
 * Wert und Optionen kommen im selben `feld`-Objekt an -> sie können nicht
 * auseinanderlaufen. Die <option>-Liste wird nur neu aufgebaut, wenn sich die
 * Optionen tatsächlich geändert haben; der ausgewählte Index wird bei jedem
 * Patch anhand des aktuellen Werts gesetzt.
 */
export class DsSelectElement extends HTMLElement {
  private feldDaten?: FeldView;
  private aufgebaut = false;
  private auswahl!: HTMLSelectElement;
  private labelEl!: HTMLElement;
  private fehlerEl!: HTMLElement;
  private optionenSignatur = '';
  private optionen: ReadonlyArray<SelectOption> = [];

  set feld(view: FeldView) {
    this.feldDaten = view;
    if (!this.aufgebaut) {
      this.aufbau();
    }
    this.aktualisiere();
  }
  get feld(): FeldView | undefined {
    return this.feldDaten;
  }

  connectedCallback(): void {
    if (this.feldDaten && !this.aufgebaut) {
      this.aufbau();
      this.aktualisiere();
    }
  }

  private aufbau(): void {
    this.innerHTML = `
      <label class="ds-feld">
        <span class="ds-feld__label"></span>
        <select class="ds-feld__control"></select>
        <span class="ds-feld__fehler" hidden></span>
      </label>`;
    this.auswahl = this.querySelector('select')!;
    this.labelEl = this.querySelector('.ds-feld__label')!;
    this.fehlerEl = this.querySelector('.ds-feld__fehler')!;

    this.auswahl.addEventListener('change', () => {
      const index = Number(this.auswahl.value);
      const wert = Number.isNaN(index) ? undefined : this.optionen[index]?.wert;
      this.dispatchEvent(new CustomEvent('wertGeaendert', { detail: wert }));
    });

    this.aufgebaut = true;
  }

  private aktualisiere(): void {
    const f = this.feldDaten;
    if (!f) {
      return;
    }
    this.labelEl.textContent = f.label;
    this.auswahl.disabled = !f.bearbeitbar;

    this.baueOptionen(f.optionen);

    const index = this.optionen.findIndex((o) => gleich(o.wert, f.wert));
    this.auswahl.value = index >= 0 ? String(index) : '';

    const fehler = f.fehler[0] ?? '';
    this.fehlerEl.textContent = fehler;
    this.fehlerEl.hidden = fehler === '';
  }

  private baueOptionen(optionen: ReadonlyArray<SelectOption>): void {
    const signatur = optionen.map((o) => o.label).join('|');
    if (signatur === this.optionenSignatur) {
      return;
    }
    this.optionenSignatur = signatur;
    this.optionen = optionen;
    this.auswahl.innerHTML =
      `<option value="">Bitte auswählen</option>` +
      optionen.map((o, i) => `<option value="${i}">${escape(o.label)}</option>`).join('');
  }
}

function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
