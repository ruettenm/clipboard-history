import 'zone.js/dist/zone-mix'
import 'reflect-metadata'
import '../polyfills'

import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { ElectronService } from './services/electron.service'
import { ClipboardService } from './services/clipboard.service'
import { SettingsService } from './services/settings.service'
import { ModalService } from './services/modal.service'

import { WebviewDirective } from './directives/webview.directive'
import { OcticonDirective } from './directives/octicon.directive'
import { CustomTranslateLoader } from './common/CustomTranslateLoader'

import { AppComponent } from './app.component'
import { ClipboardHistoryComponent } from './components/clipboard-history/clipboard-history.component'
import { HelpModalContentComponent } from './components/modal/help-modal-content.component'
import { SettingsModalContentComponent } from './components/modal/settings-modal-content.component'

@NgModule({
    declarations: [
        AppComponent,
        ClipboardHistoryComponent,
        HelpModalContentComponent,
        SettingsModalContentComponent,
        WebviewDirective,
        OcticonDirective
    ],
    imports: [
        BrowserModule,
        NgbModule.forRoot(),
        FormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: CustomTranslateLoader
            }
        })
    ],
    providers: [
        ElectronService,
        ClipboardService,
        SettingsService,
        ModalService
    ],
    entryComponents: [
        HelpModalContentComponent,
        SettingsModalContentComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
