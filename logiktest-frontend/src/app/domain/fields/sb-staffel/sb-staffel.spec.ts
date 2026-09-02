import { BEHALTEN } from '../../../core/engine';
import { fakeKontext } from '../../testing/fake-kontext';
import { sbStaffelDatenmanipulation } from './sb-staffel.datenmanipulation';
import { sbStaffelWertebereich } from './sb-staffel.wertebereich';

describe('sbStaffelWertebereich', () => {
  it('bietet 150/250 für ARB 2015–2019', () => {
    const werte = sbStaffelWertebereich(fakeKontext({ werte: { arb: 2018 } })).map((o) => o.wert);
    expect(werte).toEqual([150, 250]);
  });

  it('bietet 150/300 sonst', () => {
    const werte = sbStaffelWertebereich(fakeKontext({ werte: { arb: 2024 } })).map((o) => o.wert);
    expect(werte).toEqual([150, 300]);
  });
});

describe('sbStaffelDatenmanipulation', () => {
  it('setzt undefined, wenn der Wert nach ARB-Wechsel nicht mehr erlaubt ist', () => {
    expect(sbStaffelDatenmanipulation(fakeKontext({ werte: { arb: 2024, sbStaffel: 250 } }))).toEqual(
      { wert: undefined },
    );
  });

  it('behält einen weiterhin gültigen Wert', () => {
    expect(sbStaffelDatenmanipulation(fakeKontext({ werte: { arb: 2024, sbStaffel: 150 } }))).toBe(
      BEHALTEN,
    );
  });

  it('lässt undefined unangetastet', () => {
    expect(sbStaffelDatenmanipulation(fakeKontext({ werte: { arb: 2018 } }))).toBe(BEHALTEN);
  });
});
