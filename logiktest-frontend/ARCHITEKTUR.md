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
- `risikoart-katalog.ts` (Werte je Versicherer), `kombinatorik.ts` (RA15 sperrt,
  RA10 braucht Partner 19/119, jede RA max. 1×), `kapazitaet.ts` (RA -> Fahrzeuge/
  Grundstücke Pflicht/keine), `nutzung-katalog.ts` (Nutzungsarten + Einheit je RA24/RA25).
- `deckung.store.ts` – Liste der Deckungen, `hinzufuegen` / `entfernen`, `aendereFeld()`.

## UI

- `features/ui/webcomponents/` – native Custom Elements `ds-input` / `ds-select`.
  Setter `feld` (ein `FeldView`-Objekt), Event `wertGeaendert` (nur bei **blur** /
  Auswahl, nicht pro Tastendruck). DOM wird einmal aufgebaut, danach nur gepatcht.
- `features/ui/feld-host.component.ts` – geteilte Darstellung, rendert nichts bei
  `!view().sichtbar`; `display:contents` am Wrapper -> unsichtbare Felder belegen
  keine Grid-Zelle, folgende Felder rücken nach.
- `features/formular/` – Shell mit 3 Tabs, `tab-konfiguration.ts` ist die **einzige**
  Stelle, die Feld ↔ Tab kennt. `formular.store.ts` klammert alles zusammen
  (Navigation nur bei gültigem Vor-Tab, Import/Reset, `payload()`).

## Tests

`npm test` – reine Logik-Dateien (`*.spec.ts`) + Engine-Integration
(`core/engine/regel-engine.spec.ts`: Import unterdrückt Datenmanipulation, Fixpunkt).
