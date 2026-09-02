# Regel-Engine – Architektur

## Idee in einem Satz

Jedes Feld hat **einen** schreibbaren Zustand (`rohWert`, ein Signal). Sichtbarkeit,
Optionen, Fehler, Gültigkeit und die an die UI gebundene `view` sind reine
`computed`-Ableitungen. Werte anderer Felder ändern (`datenmanipulation`) macht nur
ein einziger, imperativer Engine-Durchlauf – und der läuft **nicht** beim Import.

## Kern (`src/app/core/engine/`)

| Datei | Aufgabe |
|---|---|
| `feld.model.ts` | Grundtypen: `FeldView`, `Steuerung`, `SelectOption`, `BEHALTEN`, `setze`, `leeren` |
| `feld-modul.ts` | `FeldModul<T, K>` – bündelt die 4 Logik-Teile + Metadaten |
| `regel-kontext.ts` | `RegelKontext` – einzige Lese-Schnittstelle für Logik-Dateien (`wert()`, `feld()`, `auth`, `dienste`) |
| `feld-runtime.ts` | `FeldRuntime` – `rohWert` + alle `computed` + optionale Async-Validierung |
| `regel-engine.ts` | `propagieren()` – Fixpunkt-Iteration in topologischer Reihenfolge |
| `feld-store.ts` | `FeldStore` – `initialisieren` / `benutzerAenderung` / `importieren` / `werte()` |

### Die Import-Regel

```
initialisieren()      -> Initialwerte, dann propagieren()   (Defaults werden gesetzt)
benutzerAenderung()   -> Wert setzen, dann propagieren()     (Regeln greifen)
importieren()         -> nur Werte setzen, KEIN propagieren  (Import bleibt stehen)
```

`steuerung` / `wertebereich` / `validierung` sind reine `computed` und rechnen nach
dem Import sofort aus den importierten Werten neu – nur die wertändernde
`datenmanipulation` bleibt aus, bis die nächste `benutzerAenderung()` kommt.
`FeldRuntime` markiert zusätzlich jedes Select-Feld als ungültig, dessen Wert nicht
(mehr) in seinem aktuellen Wertebereich liegt – so wird eine inkonsistente Import-
Auswahl sichtbar, statt stillschweigend „leer, aber gültig“ zu sein.

## Ein Feld = ein Ordner (`src/app/domain/fields/<feld>/`)

```
<feld>.steuerung.ts          (ctx) => { sichtbar, bearbeitbar, relevant }
<feld>.wertebereich.ts       (ctx) => SelectOption[]
<feld>.datenmanipulation.ts  (ctx) => setze(x) | leeren() | BEHALTEN
<feld>.validierung.ts        (ctx) => string[]   (+ optional asyncValidierung)
<feld>.feld.ts               setzt die Teile zu einem FeldModul zusammen
<feld>-field.component.ts    ~4-Zeilen-Wrapper: nur feldId, delegiert an FeldHostComponent
```

`vertragsdaten.felder.ts` sammelt alle FeldModule; `vertragsdaten.store.ts` ist der
`FeldStore` als Angular-Service.

## Deckungen (`src/app/domain/deckungen/`)

Baut auf demselben `FeldStore` auf, nur mit erweitertem Kontext:

- `DeckungRuntime` – eigener `FeldStore<DeckungKontext>` für `risikoart/rabatt/zuschlag`
  plus Kind-Listen `fahrzeuge` / `grundstuecke` (Signale).
- `risikoart-katalog.ts` (Werte je Versicherer), `kombinatorik.ts` (RA15/102015 nur
  bei genau einer Deckung; RA10/200010 nur allein oder mit genau einem Partner
  19/119 bzw. 310019/310119; jede RA max. 1×), `kapazitaet.ts` (RA -> Fahrzeuge/
  Grundstücke Pflicht/keine), `nutzung-katalog.ts` (Nutzungsarten + Einheit je RA24/RA25).
- `deckung.store.ts` – Liste der Deckungen, `hinzufuegen` / `entfernen`, `aendereFeld()`,
  `initialisieren()` (alles verwerfen -> genau eine Default-Deckung).
- **Versichererwechsel:** `versicherer-field.component.ts` überschreibt `aendern()` –
  ändert der Benutzer den Versicherer wirklich, ruft es `deckungStore.initialisieren()`
  (alle Deckungen weg, eine neue Default-Deckung für den neuen Versicherer). Läuft
  nur bei Benutzeränderung, nicht bei Init/Import.

## UI

- Web Components: **HUK Shield** (`s-text-field` / `s-select` / `s-menu-item`),
  geladen per `<script>`/`<link>` in `src/index.html` (CDN). Angular nutzt
  `CUSTOM_ELEMENTS_SCHEMA`.
- `features/ui/feld-host.component.ts` – die **einzige** Stelle, die die `s-*`-
  Components kennt. Bindet genau EIN `view()`-Objekt:
  `s-text-field`: `[value]`, `[input-type]`, `[disabled]=!bearbeitbar`,
  `[severity]=fehler? 'critical':'none'`, `(sChange)` -> `CustomEvent<string>`.
  `s-select`: `[value]` (String), `@for`-`s-menu-item` aus `view().optionen`,
  `(sChange)` -> `CustomEvent<string[]>` (erster Eintrag, zurückgemappt auf den
  echten Options-Wert). Rendert nichts bei `!view().sichtbar`; `display:contents`
  am Host (`.feld-slot`) -> unsichtbare Felder belegen keine Grid-Zelle, folgende
  Felder rücken nach.
- Pro Feld eine ~4-Zeilen-Komponente (`<feld>-field.component.ts`), die nur ihre
  `feldId` kennt und `rt.view()` an `app-feld-host` weiterreicht.
- `features/formular/` – Shell mit 3 Tabs, `tab-konfiguration.ts` ist die **einzige**
  Stelle, die Feld ↔ Tab kennt. `formular.store.ts` klammert alles zusammen
  (Navigation nur bei gültigem Vor-Tab, Import/Reset, `payload()`).

## Logging (`core/engine/engine-logger.ts`)

Der imperative Teil protokolliert in die Browser-Konsole, **welche Logik lief** und
**welcher Wert gesetzt wurde**:

```
[Regel:vertragsdaten] benutzerAenderung  tarif = "S2019"
[Regel:vertragsdaten] datenmanipulation — benutzerAenderung tarif  (2 Änderung(en), 2 Runde(n))
[Regel:vertragsdaten]   arb.datenmanipulation: undefined → 2020
[Regel:vertragsdaten]   tarifgruppe.datenmanipulation: undefined → "SELBSTSTAENDIG"
[Regel:deckung#1] datenmanipulation — geschwister-aenderung  (1 Änderung(en), 1 Runde(n))
[Regel:deckung#1]   risikoart.datenmanipulation: "23" → "19"
```

Auch `initialisieren` und `import (ohne Regel-Durchlauf)` werden geloggt. Steuern in
der Konsole: `regelLog.aktiv = false` (aus), `regelLog.verbose = true` (zusätzlich
"behalten" + `steuerung`/`wertebereich`). `regelLog` / `setzeRegelLog` liegen auf
`window`.

## Tests

`npm test` – reine Logik-Dateien (`*.spec.ts`) + Engine-Integration
(`core/engine/regel-engine.spec.ts`: Import unterdrückt Datenmanipulation, Fixpunkt).
