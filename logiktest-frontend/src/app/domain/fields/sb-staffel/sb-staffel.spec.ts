import { KEEP } from '../../../core/engine';
import { fakeContext } from '../../testing/fake-context';
import { sbStaffelDatenmanipulation } from './sb-staffel.datenmanipulation';
import { sbStaffelWertebereich } from './sb-staffel.wertebereich';

describe('sbStaffelWertebereich', () => {
  it('bietet 150/250 für ARB 2015–2019', () => {
    const values = sbStaffelWertebereich(fakeContext({ values: { arb: 2018 } })).map((o) => o.value);
    expect(values).toEqual([150, 250]);
  });

  it('bietet 150/300 sonst', () => {
    const values = sbStaffelWertebereich(fakeContext({ values: { arb: 2024 } })).map((o) => o.value);
    expect(values).toEqual([150, 300]);
  });
});

describe('sbStaffelDatenmanipulation', () => {
  it('setzt undefined, wenn der Wert nach ARB-Wechsel nicht mehr erlaubt ist', () => {
    expect(
      sbStaffelDatenmanipulation(fakeContext({ values: { arb: 2024, sbStaffel: 250 } })),
    ).toBeUndefined();
  });

  it('behält einen weiterhin gültigen Wert', () => {
    expect(sbStaffelDatenmanipulation(fakeContext({ values: { arb: 2024, sbStaffel: 150 } }))).toBe(
      KEEP,
    );
  });

  it('lässt undefined unangetastet', () => {
    expect(sbStaffelDatenmanipulation(fakeContext({ values: { arb: 2018 } }))).toBe(KEEP);
  });
});
