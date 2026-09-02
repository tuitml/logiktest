import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { regelLog, setzeRegelLog } from './app/core/engine/engine-logger';

// Regel-Logging in der Browser-Konsole steuerbar machen:
//   regelLog.aktiv = false        -> aus
//   regelLog.verbose = true       -> zusätzlich "behalten" + steuerung/wertebereich
(globalThis as unknown as { regelLog: typeof regelLog; setzeRegelLog: typeof setzeRegelLog }).regelLog =
  regelLog;
(globalThis as unknown as { setzeRegelLog: typeof setzeRegelLog }).setzeRegelLog = setzeRegelLog;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
