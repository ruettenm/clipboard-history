import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { Environment } from './app/common/Environment'

if (Environment.isProduction()) {
    enableProdMode()
}

platformBrowserDynamic()
    .bootstrapModule(AppModule, {
        preserveWhitespaces: false
    })
    .catch(err => console.error(err))
