import 'zone.js/dist/zone-mix'
import 'reflect-metadata'
import '../polyfills'

import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HttpClient } from '@angular/common/http'

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { ElectronService } from './services/electron.service'
import { ClipboardService } from './services/clipboard.service'

import { WebviewDirective } from './directives/webview.directive'

import { AppComponent } from './app.component'
import { ClipboardHistoryComponent } from './pages/clipboard-history/clipboard-history.component'

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
    declarations: [
        AppComponent,
        ClipboardHistoryComponent,
        WebviewDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [ HttpClient ]
            }
        })
    ],
    providers: [
        ElectronService,
        ClipboardService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
