import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registriereWebComponents } from './app/features/ui/webcomponents/register';

registriereWebComponents();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
