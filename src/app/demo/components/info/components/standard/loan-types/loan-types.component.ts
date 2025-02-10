import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Globals } from 'src/app/class/globals';
import { StdPaginationsWithPopupComponent } from 'src/app/demo/components/std-paginations-with-popup/std-paginations-with-popup.component';

@Component({
  selector: 'app-loan-types',
  templateUrl: './loan-types.component.html',
  styleUrl: './loan-types.component.scss',
  providers: [MessageService],
  standalone: true,
  imports: [StdPaginationsWithPopupComponent]
})
export class LoanTypesComponent {
  breadItems: any;
  customVar: boolean = true;
  constructor(
    private translate: TranslateService
  ) {

    // bread crumb
    this.translate.onLangChange.subscribe(() => {
      this.updateTranslationsCustom();
    });

    this.updateTranslationsCustom();
  }

  endPoint!: any;


  ngOnInit() {
    this.endPoint = 'LoanTypes';

    // adding this Configurations in each Component Customized
    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);

      // bread crumb
      this.translate.onLangChange.subscribe(() => {
        this.updateTranslationsCustom();
      });

      this.updateTranslationsCustom();
    })
  }

  updateTranslationsCustom() {
    this.breadItems = [
      {
        icon: 'pi pi-home',
        route: '/', label: this.translate.instant("breadcrumb.gen.home"), start: true
      },
      {
        label: this.translate.instant('breadcrumb.cats.manageTypes.title'),
        iconPath: ''
      },
      {
        label: this.translate.instant(`breadcrumb.cats.manageTypes.items.${this.endPoint}`),
      }];
  }

}
