import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { CompanyBasicDataService } from './company-basic-data.service';
import { Globals } from 'src/app/class/globals';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-basic-data',
  standalone: true,
  imports: [
    GlobalsModule,
    PrimeNgModule
],
providers: [MessageService],
  templateUrl: './company-basic-data.component.html',
  styleUrl: './company-basic-data.component.scss'
})
export class CompanyBasicDataComponent {
  
  // end point 
  @Input() endPoint!: string;

  // company basic data 
  companyData: FormGroup = new FormGroup({
    companyName: new FormControl(null, Validators.required),
    companyAddress: new FormControl(null, Validators.required),
    companyPhone: new FormControl(null, Validators.required),
    hrEmail: new FormControl(null, Validators.required),
    payRollAccountantPhone: new FormControl(null, Validators.required),
  });

  company:any = {
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    hrEmail: "",
    payRollAccountantPhone: ""
  }

  constructor(private _CompanyBasicDataService: CompanyBasicDataService,
    private messageService: MessageService,
    private translate : TranslateService
  ) {}

  ngOnInit() {

    this.endPoint = "CompanyBasicData";


    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);

      // update mainLang at Service
      this._CompanyBasicDataService.setCulture(mainLang);

      // update endpoint
      this._CompanyBasicDataService.setEndPoint(this.endPoint);

      // then, load data again to lens on the changes of mainLang & endPoints Call
      this.getCompanyDate();
    });
  }

  getCompanyDate() {
    this._CompanyBasicDataService.getData().subscribe({
      next: (res) => {
       this.company = res.data
      }
    })
  }
  
  registerData(companyData: FormGroup) {
    if(companyData.valid) {
      this._CompanyBasicDataService.register(companyData.value).subscribe({
        next: (res) => {
            // show message for user to show processing of deletion.
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('Success'),
              detail: res.message ,
              life: 3000,
          });
        }
      })
    }
  }
}
