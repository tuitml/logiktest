import type {
  AuthReader,
  FieldId,
  FieldReader,
  MandantPermission,
  RuleContext,
  Services,
} from '../../core/engine';

/** Minimaler RuleContext für Unit-Tests der reinen Logik-Dateien. */
export function fakeContext(options?: {
  values?: Record<FieldId, unknown>;
  permission?: MandantPermission;
  validTarife?: string[];
  plzOk?: boolean;
}): RuleContext {
  const values = options?.values ?? {};
  const permission = options?.permission ?? 'both';
  const validTarife = options?.validTarife ?? [];

  const auth: AuthReader = {
    permission: () => permission,
  };

  const services: Services = {
    tarif: {
      validTarife: () => validTarife,
      isValid: (t) => validTarife.includes(t),
    },
    plz: { check: () => Promise.resolve(options?.plzOk ?? true) },
  };

  const field = (id: FieldId): FieldReader => ({
    sichtbar: true,
    bearbeitbar: true,
    relevant: true,
    gueltig: true,
    options: [],
    value: <T>() => values[id] as T | undefined,
  });

  return {
    value: <T>(id: FieldId) => values[id] as T | undefined,
    field,
    auth,
    services,
  };
}
