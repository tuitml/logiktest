import { KEEP } from '../../../core/engine';
import { fakeContext } from '../../testing/fake-context';
import { zahlungsartDatenmanipulation } from './zahlungsart.datenmanipulation';
import { zahlungsartSteuerung } from './zahlungsart.steuerung';
import { zahlungsartWertebereich } from './zahlungsart.wertebereich';

describe('zahlungsart', () => {
  it('Wertebereich: Überweisung / Lastschrifteinzug', () => {
    expect(zahlungsartWertebereich(fakeContext()).map((o) => o.value)).toEqual([
      'UEBERWEISUNG',
      'LASTSCHRIFTEINZUG',
    ]);
  });

  it('ARB < 2025 -> nicht sichtbar / nicht relevant, ARB >= 2025 -> sichtbar & veränderbar', () => {
    expect(zahlungsartSteuerung(fakeContext({ values: { arb: 2024 } }))).toEqual({
      sichtbar: false,
      bearbeitbar: false,
      relevant: false,
    });
    expect(zahlungsartSteuerung(fakeContext({ values: { arb: 2025 } }))).toEqual({
      sichtbar: true,
      bearbeitbar: true,
      relevant: true,
    });
  });

  it('Datenmanipulation: ARB < 2025 -> undefined, sonst KEEP', () => {
    expect(zahlungsartDatenmanipulation(fakeContext({ values: { arb: 2024 } }))).toBeUndefined();
    expect(zahlungsartDatenmanipulation(fakeContext({ values: {} }))).toBeUndefined();
    expect(zahlungsartDatenmanipulation(fakeContext({ values: { arb: 2026 } }))).toBe(KEEP);
  });
});
