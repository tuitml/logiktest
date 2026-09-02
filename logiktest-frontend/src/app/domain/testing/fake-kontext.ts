import type { AuthLese, Dienste, FeldId, FeldLese, RegelKontext, Rolle } from '../../core/engine';

/** Minimaler RegelKontext für Unit-Tests der reinen Logik-Dateien. */
export function fakeKontext(optionen?: {
  werte?: Record<FeldId, unknown>;
  rollen?: Rolle[];
  gueltigeTarife?: string[];
  plzOk?: boolean;
}): RegelKontext {
  const werte = optionen?.werte ?? {};
  const rollen = optionen?.rollen ?? ['RBBER_HUK', 'RBBER_VRK'];
  const gueltigeTarife = optionen?.gueltigeTarife ?? [];

  const auth: AuthLese = {
    rollen: () => rollen,
    hatRolle: (r) => rollen.includes(r),
    hatNurRolle: (r) => rollen.length === 1 && rollen[0] === r,
    hatAlleRollen: (...r) => r.every((x) => rollen.includes(x)),
  };

  const dienste: Dienste = {
    tarif: {
      gueltigeTarife: () => gueltigeTarife,
      istGueltig: (t) => gueltigeTarife.includes(t),
    },
    plz: { pruefe: () => Promise.resolve(optionen?.plzOk ?? true) },
  };

  const feld = (id: FeldId): FeldLese => ({
    sichtbar: true,
    bearbeitbar: true,
    relevant: true,
    gueltig: true,
    optionen: [],
    wert: <T>() => werte[id] as T | undefined,
  });

  return {
    wert: <T>(id: FeldId) => werte[id] as T | undefined,
    feld,
    auth,
    dienste,
  };
}
