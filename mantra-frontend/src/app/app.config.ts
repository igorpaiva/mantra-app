import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { provideMarkdown } from 'ngx-markdown';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import * as Hammer from 'hammerjs';
import { authInterceptor } from './interceptors/auth.interceptor';

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { 
      direction: Hammer.DIRECTION_ALL,
      threshold: 10,
      velocity: 0.1
    },
    pinch: { enable: false },
    rotate: { enable: false }
  };

  override buildHammer(element: HTMLElement) {
    const mc = super.buildHammer(element);
    
    console.log('Setting up Hammer for element:', element);
    
    const swipe = (mc as any).get('swipe');
    if (swipe) {
      swipe.set({ 
        direction: Hammer.DIRECTION_ALL,
        threshold: 10,
        velocity: 0.1
      });
      console.log('Swipe gesture configured');
    }

    return mc;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideMarkdown(),
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};