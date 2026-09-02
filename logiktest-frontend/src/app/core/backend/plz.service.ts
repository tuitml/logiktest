import { Injectable } from '@angular/core';

/**
 * Stub für den PLZ-Prüfdienst des Backends.
 * Antwortet asynchron, ob eine (formal korrekte) PLZ bekannt ist.
 */
@Injectable({ providedIn: 'root' })
export class PlzService {
  private readonly bekannt = new Set([
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
    '96450'
  ]);

  pruefe(plz: string): Promise<boolean> {
    return new Promise((aufloesen) => {
      setTimeout(() => aufloesen(this.bekannt.has(plz)), 500);
    });
  }
}
