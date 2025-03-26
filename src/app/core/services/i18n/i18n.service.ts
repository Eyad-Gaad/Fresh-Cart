import { BrowserPlatformService } from './../browserPlatform/browser-platform.service';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  // Inject BrowserPlatformService.
  browserPlatformService:BrowserPlatformService = inject(BrowserPlatformService);
  currentLanguage = 'en';

  // check user language at constructor initilization.
  constructor(private translate: TranslateService) {
    if(this.browserPlatformService.checkPlatform()){
      const storedLang = localStorage.getItem('language');
    if (storedLang) {
      this.translate.use(storedLang);
    } else {
      const defaultLang = 'en'
      this.translate.use(defaultLang);
      localStorage.setItem('language', defaultLang);
    }
    }
    this.changeDirection();
  }

  // switch user language.
  switchLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
    this.translate.use(languageCode);
    localStorage.setItem('language', languageCode);
    this.changeDirection();
  }

  // change direction (based on two languages english and arabic).
  changeDirection(){
    if(this.browserPlatformService.checkPlatform()){
      if(localStorage.getItem('language')==='en'){
        document.body.dir = 'ltr';
      }
      else{
        document.body.dir = 'rtl';
      }
    }
  }
}
