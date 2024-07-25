import {Express} from 'express';
import {createContainer, asClass, InjectionMode} from 'awilix';

import {CaseTypeJurisdictionAutoSuggest} from '../../service/CaseTypeJurisdictionAutoSuggest';
import {AuthService} from '../../service/AuthService';

import config from 'config';

export class Container {
  public enableFor(app: Express): void {
    const container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });
    container.register({
      authService: asClass(AuthService)
        .singleton()
        .inject(() => { return {config: config}; }),
      autoSuggestService: asClass(CaseTypeJurisdictionAutoSuggest)
        .singleton()
        .inject(() => {
          return {
            config: config,
          };
        }),
    });

    app.locals.container = container;
  }
}
