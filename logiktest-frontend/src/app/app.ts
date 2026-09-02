import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormularComponent } from './features/formular/formular.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormularComponent],
  template: `<app-formular />`,
})
export class App {}
