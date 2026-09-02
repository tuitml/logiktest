import { DsInputElement } from './ds-input.element';
import { DsSelectElement } from './ds-select.element';

/** Einmalig vor dem Bootstrap aufrufen. */
export function registriereWebComponents(): void {
  if (!customElements.get('ds-input')) {
    customElements.define('ds-input', DsInputElement);
  }
  if (!customElements.get('ds-select')) {
    customElements.define('ds-select', DsSelectElement);
  }
}
