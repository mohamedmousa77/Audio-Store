import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

import { errorInterceptor } from './core/interceptors/error-interceptor';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { loggingInterceptor } from './core/interceptors/logging-interceptor';
import { sessionIdInterceptor } from './core/interceptors/session-id.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([
        sessionIdInterceptor,  // Must be first for guest users
        authInterceptor,
        ...(environment.enableLogging ? [loggingInterceptor] : []),
        errorInterceptor
      ])
    ),
    provideAnimations()
  ]
};
