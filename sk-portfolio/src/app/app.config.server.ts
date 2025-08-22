import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// The 'ServerModule' is no longer imported or used.

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // This is the single, correct way to enable SSR.
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);