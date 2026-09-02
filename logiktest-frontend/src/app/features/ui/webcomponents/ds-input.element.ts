import type { FeldView } from '../../../core/engine';

/**
 * Native Web Component für Text-/Zahlen-Eingaben.
 *
 * Bekommt genau EIN Objekt (`feld`) gesetzt. Die DOM-Struktur wird nur einmal
 * aufgebaut; danach werden nur Attribute/Werte gepatcht. Der Eingabewert wird
 * nie überschrieben, solange das Feld den Fokus hat -> kein "Springen" beim Tippen.
 */
export class DsInputElement extends HTMLElement {
  private feldDaten?: FeldView;
  private aufgebaut = false;
  private eingabe!: HTMLInputElement;
  private labelEl!: HTMLElement;
  private fehlerEl!: HTMLElement;
  private hinweisEl!: HTMLElement;

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
        <input class="ds-feld__control" />
        <span class="ds-feld__hinweis" hidden>Prüfung läuft…</span>
        <span class="ds-feld__fehler" hidden></span>
      </label>`;
    this.eingabe = this.querySelector('input')!;
    this.labelEl = this.querySelector('.ds-feld__label')!;
    this.fehlerEl = this.querySelector('.ds-feld__fehler')!;
    this.hinweisEl = this.querySelector('.ds-feld__hinweis')!;

    // Wert wird erst beim Verlassen des Feldes gemeldet (change = blur / Enter),
    // nicht bei jedem Tastendruck.
    this.eingabe.addEventListener('change', () => {
      const roh = this.eingabe.value;
      const istZahl = this.feldDaten?.typ === 'zahl';
      const wert = roh === '' ? undefined : istZahl ? Number(roh) : roh;
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
    this.eingabe.type = f.typ === 'zahl' ? 'number' : 'text';
    this.eingabe.disabled = !f.bearbeitbar;

    const soll = f.wert == null ? '' : String(f.wert);
    if (document.activeElement !== this.eingabe && this.eingabe.value !== soll) {
      this.eingabe.value = soll;
    }

    const fehler = f.fehler[0] ?? '';
    this.fehlerEl.textContent = fehler;
    this.fehlerEl.hidden = fehler === '';
    this.hinweisEl.hidden = !f.pruefungLaeuft;
  }
}
