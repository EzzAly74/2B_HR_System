import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { ResignationSettingService } from './resignation-setting.service';

@Component({
  selector: 'app-resignation-setting',
  standalone: true,
  imports: [
    GlobalsModule,
    PrimeNgModule
  ],
  templateUrl: './resignation-setting.component.html',
  styleUrl: './resignation-setting.component.scss'
})
export class ResignationSettingComponent {
  
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
  
    constructor(
      private  _ResignationService: ResignationSettingService,
      private messageService: MessageService,
      private translate : TranslateService
    ) {}
  
    ngOnInit() {
  
      this.endPoint = "resignationSetting";
      
      Globals.getMainLangChanges().subscribe((mainLang) => {
        console.log('Main language changed to:', mainLang);
  
        // update mainLang at Service
        this._ResignationService.setCulture(mainLang);
  
        // update endpoint
        this._ResignationService.setEndPoint(this.endPoint);
  
        // then, load data again to lens on the changes of mainLang & endPoints Call
        this.getCompanyDate();
      });
    }
  
    getCompanyDate() {
      this._ResignationService.getForDashboard().subscribe({
        next: (res) => {
         this.company = res.data
        }
      })
    }
    
    registerData(companyData: FormGroup) {
      if(companyData.valid) {
        this._ResignationService.register(companyData.value).subscribe({
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