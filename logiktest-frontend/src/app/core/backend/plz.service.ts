import { Injectable } from '@angular/core';

/**
 * Stub für den PLZ-Prüfdienst des Backends.
 * Antwortet asynchron, ob eine (formal korrekte) PLZ bekannt ist.
 */
@Injectable({ providedIn: 'root' })
export class PlzService {
  private readonly known = new Set([
    '10115',
    '20095',
    '30159',
    '40213',
    '50667',
    '60311',
    '70173',
    '80331',
    '01067',
    '04109',
    '96450',
    '15236',
  ]);

  check(plz: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.known.has(plz)), 500);
    });
  }
}
