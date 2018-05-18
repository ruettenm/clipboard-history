import { TranslateLoader } from '@ngx-translate/core'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

import { en } from '../../assets/i18n/en'
import { de } from '../../assets/i18n/de'

export class CustomTranslateLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            if (lang === 'de') {
                observer.next(de)
            } else {
                observer.next(en)
            }
            observer.complete()
        })
    }
}
