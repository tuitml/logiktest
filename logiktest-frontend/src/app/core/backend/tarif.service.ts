import { Injectable } from '@angular/core';

/**
 * Stub für den Tarif-Katalog des Backends.
 * Die Liste der gültigen Tarife liegt clientseitig vor -> synchrone Prüfung.
 */
@Injectable({ providedIn: 'root' })
export class TarifService {
  private readonly valid: ReadonlyArray<string> = [
    'N1526',
    'N1519',
    'N2013',
    'N2019',
    'N2021',
    'N2426',
    'N2600',
    'B1526',
    'B2013',
    'B2019',
    'B2021',
    'B2426',
    'S1526',
    'S2013',
    'S2019',
    'S2021',
    'S2426',
    'S2600',
    'N23',
    'N26',
    'N1826',
  ];

  validTarife(): ReadonlyArray<string> {
    return this.valid;
  }

  isValid(tarif: string): boolean {
    return this.valid.includes(tarif);
  }
}
