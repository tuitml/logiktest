# Regel-Engine – Architektur

Fachbegriffe (Feldnamen, `deckungen`, `steuerung`, `wertebereich`,
`datenmanipulation`, `validierung`, …) sind deutsch; der übrige Code ist englisch.

## Idee in einem Satz

Jedes Feld hat **einen** schreibbaren Wert (`value`, ein Signal). `steuerung`,
`options`, `errors`, `gueltig` und die an die UI gebundene `view` sind reine
`computed`-Ableitungen. Nur *Werte anderer Felder verändern* (`datenmanipulation`)
ist imperativ – ein Engine-Durchlauf, der **beim Import ausgelassen** wird.

## Kern (`src/app/core/engine/`)

| Datei | Aufgabe |
|---|---|
| `field.model.ts` | `FieldId`, `FieldType`, `SelectOption`, `Steuerung`, `FieldView`, `KEEP`, `DatenmanipulationResult<T> = T \| undefined \| typeof KEEP` |
| `rule-context.ts` | `RuleContext` – einzige Lese-Schnittstelle für Logik-Dateien (`value()`, `field()`, `auth`, `services`). `auth.permission()` -> `'none' \| 'huk' \| 'vrk' \| 'both'` |
| `field-module.ts` | `FieldModule<T, K>` – bündelt die 4 Logik-Teile + Metadaten (`id`, `label`, `type`, `initialValue?`, `dependencies`) |
| `field-runtime.ts` | `FieldRuntime` – `value` + alle `computed` (`steuerung`, `options`, `syncErrors`, `errors`, `gueltig`, `view`) + optionale Async-Validierung |
| `rule-engine.ts` | `RuleEngine.propagate()` – Fixpunkt-Iteration in topologischer Reihenfolge |
| `field-store.ts` | `FieldStore` – `initialize` / `applyUserChange` / `applyRules` / `applyImport` / `values` |
| `equal.ts` | `equal(a, b)` für Primitive + flache Arrays |

### Datenmanipulation

`datenmanipulation(ctx)` gibt **direkt einen Wert** (auch `undefined`) oder `KEEP`
zurück – keine Hüll-Objekte, keine `setze()`/`leeren()`-Helfer. Die Engine:

```
propagate(maxIter = 20):
  wiederhole bis nichts mehr ändert:
    für jedes Feld in topologischer Reihenfolge:
      r = module.datenmanipulation(ctx)
      wenn r === KEEP  -> weiter
      wenn !equal(r, rt.value()) -> rt.value.set(r)
```

### Lebenszyklus (`FieldStore`)

```
initialize()          -> value = initialValue für alle; danach propagate()  (Defaults)
applyUserChange(id,v)  -> value setzen; danach propagate()                    (Regeln greifen)
applyImport(data)      -> nur Werte setzen; KEIN propagate()                  (Import bleibt stehen)
```

`steuerung` / `wertebereich` / `validierung` sind reine `computed` und rechnen
nach dem Import sofort aus den importierten Werten neu. `FieldRuntime` markiert
jedes Select-Feld als ungültig, dessen Wert nicht (mehr) in seinen aktuellen
`options` liegt – so wird eine inkonsistente Import-Auswahl sichtbar.

### Import vom Backend (`domain/import/`)

`ImportService.loadPrefill()` (Stub) -> `import-mapping.ts` übersetzt: **eine
Tabelle mit genau einem Eintrag pro App-Feld** (`VERTRAGSDATEN_MAPPING`) plus
`mapDeckung()`. Backend-Feld ≠ App-Feld (`mandant`→`versicherer`, `SB250`→`250`,
`RA_300023`→`300023`); Unbekanntes wird ignoriert. `FormularStore.importFromBackend()`
steckt das Ergebnis in `store.applyImport(...)` – ohne Regel-Durchlauf.

## Ein Feld = ein Ordner (`domain/fields/<feld>/`)

```
<feld>.steuerung.ts          (ctx) => { sichtbar, bearbeitbar, relevant }
<feld>.wertebereich.ts       (ctx) => SelectOption[]
<feld>.datenmanipulation.ts  (ctx) => wert | undefined | KEEP
<feld>.validierung.ts        (ctx) => string[]   (+ optional asyncValidierung)
<feld>.field.ts              setzt die Teile zu einem FieldModule zusammen
<feld>-field.component.ts    ~8-Zeilen-Wrapper: nur fieldId, delegiert an app-text-field / app-select-field
```

`vertragsdaten.fields.ts` sammelt alle Module; `vertragsdaten.store.ts` ist der
`FieldStore` als Angular-Service; `vertragsdaten.context.ts` baut den `RuleContext`.

### Berechtigung

Die 4 `versicherer.*.ts` lesen `ctx.auth.permission()`. `AuthStore`
(`core/auth/`) bildet das über `mandantPermission` ab – im echten System fix aus
dem Token, im Stub per `setClaims(...)` umschaltbar (Demo-Buttons -> `FormularStore
.refreshPermission()`).

### Versichererwechsel

`versicherer-field.component.ts` überschreibt `change()` – ändert der Benutzer den
Versicherer wirklich, ruft es `deckungStore.initialize()` (alle Deckungen weg,
eine neue Default-Deckung). Läuft nur bei Benutzeränderung, nicht bei Init/Import.

## Deckungen (`domain/deckungen/`)

Bauen auf demselben `FieldStore` auf, nur mit erweitertem Kontext (`DeckungContext`
kennt `ownRisikoart()` / `otherRisikoarten()`).

- `DeckungRuntime` – eigener `FieldStore` für `risikoart/rabatt/zuschlag` + Kind-
  Listen `fahrzeuge` / `grundstuecke` (Signale). Methoden `initialize` / `applyImport`
  / `applyRules` / `setField` / `addFahrzeug` / `removeGrundstueck` / …
- `risikoart-catalog.ts` (Werte je Versicherer), `combination.ts`
  (`risikoartOptions`, `canAddDeckung`: RA15/102015 nur bei genau einer Deckung;
  RA10/200010 nur allein oder mit genau einem Partner 19/119 bzw. 310019/310119;
  jede RA max. 1×), `capacity.ts` (RA -> Fahrzeuge/Grundstücke `'none' | 'required'`),
  `nutzung-catalog.ts` (Nutzungsarten + Einheit je RA24/RA25).
- `deckung.store.ts` – Liste der Deckungen, `add` / `remove` / `applyImport` /
  `changeField`, `canAdd` / `canRemove` / `valid`.

## UI (`features/ui/`)

- Web Components: **HUK Shield** (`s-text-field` / `s-select` / `s-menu-item`),
  geladen per `<script>`/`<link>` in `src/index.html`. `CUSTOM_ELEMENTS_SCHEMA`.
- `field-wrapper.base.ts` – gemeinsame Basis (`view`-Input, `valueChange`-Output,
  `hasError`, `display:contents` am Host = `.field-slot`).
- `text-field.component.ts` (`app-text-field`) -> `s-text-field`.
- `select-field.component.ts` (`app-select-field`) -> `s-select` + `@for`-
  `s-menu-item`. `value` wird per `afterRenderEffect` nach dem Render gesetzt und
  kurz wiederholt, bis `s-select` es gegen seine (asynchron hydrierten)
  `<s-menu-item>` annimmt.
- `vertragsdaten-field.base.ts` – Basis der dünnen `<feld>-field.component.ts`
  (`fieldId` + Template `TEXT_FIELD_TEMPLATE` / `SELECT_FIELD_TEMPLATE`).

## Tabs / Navigation (`features/formular/`)

`tab-config.ts` (`TAB_FIELDS`) ist die **einzige** Stelle mit Feld↔Tab-Zuordnung
(`versicherer` steht dort nicht). `FormularStore` klammert alles zusammen:
`canSwitchTo(tab)` (alle Felder vorheriger Tabs `gueltig()`), Import/Reset,
`payload()` (nur Werte relevanter Felder + verschachtelte Deckungsstruktur).

## Tests

`npm test` – reine Logik-Dateien (`*.spec.ts`) + Integration
(`rule-engine.spec.ts`: Import unterdrückt Datenmanipulation, Fixpunkt;
`deckung.store.spec.ts`: Kombinatorik; `import-mapping.spec.ts`; `versicherer.spec.ts`).
