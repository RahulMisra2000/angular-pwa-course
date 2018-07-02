import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then(() => {

// *********** Of course if you use the ANGULAR Service Worker then you wouldn't have to do this because it takes care of everything
// Here we are doing it because it is NOT being used in this sample ..... 
  if ('serviceWorker' in navigator) {

            navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            })
                .then(registration => {

                    console.log('Service worker registration completed');

                });
        }

    });
