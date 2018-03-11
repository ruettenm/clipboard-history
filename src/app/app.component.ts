import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Environment } from './common/Environment'

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {
    constructor(translate: TranslateService) {
        translate.setDefaultLang('de')

        if (Environment.isElectron()) {
            console.log('Mode electron')
        } else {
            console.log('Mode web')
        }
    }
}
