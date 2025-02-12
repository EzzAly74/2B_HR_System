import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { GetLoanPaymentDetailsService } from './get-loan-payment-details.service';
import { Globals } from 'src/app/class/globals';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-get-loan-payment-details',
  standalone: true,
  imports: [
    GlobalsModule,
    PrimeNgModule,
  ],
  providers: [MessageService, DatePipe, TranslateService],
  templateUrl: './get-loan-payment-details.component.html',
  styleUrl: './get-loan-payment-details.component.scss'
})
export class GetLoanPaymentDetailsComponent {
  constructor(
    private _GetLoanPaymentService: GetLoanPaymentDetailsService,
    private translate: TranslateService,
    private messageService: MessageService
  ) { }

  @ViewChild('dt') dt: Table;

  dropdownItemsEmployee: any;
  dropdownLoanRequests: any;

  // loading
  loading: boolean = false;

  selectedloanId: any;
  selectedEmployee: any;
  selectedEmployeeId: any[] = [];

  endPoint: string;
  registerForm: any = {};
  items!: any;
  allData: any;
  loanPaymentGetDtos!: any[];
  totalItems: any = 0;

  ngOnInit(): void {
    this.endPoint = 'Employee';

    // adding this Configurations in each Component Customized
    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);

      // update mainLang at Service
      this._GetLoanPaymentService.setCulture(mainLang);

      // update endpoint
      this._GetLoanPaymentService.setEndPoint(this.endPoint);

      // get all Drop Down Fields
      this.getALlDropDown()


      this.translate.onLangChange.subscribe(() => {
        this.updateTranslations();
      });

      this.updateTranslations();

    });

  }

  getDropDownField(self: { field: any; enum: string }) {
    this._GetLoanPaymentService.getDropdownField(self.enum).subscribe({
      next: (res) => {
        this[self.field] = res.data;
      },
      error: (err) => {
        console.log(`error in ${self.field}`)
        console.log(err);
      },
    });
  }

  getALlDropDown() {
    // get Employee Dropdown
    this.getDropDownField({ field: 'dropdownItemsEmployee', enum: 'Employee' });

  }

  updateTranslations() {
    this.items = [
      {
        icon: 'pi pi-home',
        route: '/', label: this.translate.instant("breadcrumb.gen.home"), start: true
      },
      {
        label: this.translate.instant('breadcrumb.cats.manageStructure.title'),
        iconPath: ''
      },
      {
        label: this.translate.instant(`breadcrumb.cats.manageStructure.items.GetLoanPayment`),
      }];
  }

  onSelectEmployee(event: any) {
    console.log(event);
    this.selectedEmployeeId = event.value.id;
  }

  onSelectLoan(event: any) {
    console.log(event);
    this.selectedloanId = event.value.id;
  }

  registerSubmit() {
    this.registerForm = {
      // loanId: Number(this.selectedloanId),
      employeeId: Number(this.selectedEmployeeId)
    }

    this.loading = true;

    this._GetLoanPaymentService.getLoanPayment(this.registerForm.employeeId).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res.data) {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('No Loan Payments For This Employee'),
            detail: res.message,
            life: 3000,
          });
        }

        console.log(res);
        this.allData = res.data;
        this.loanPaymentGetDtos = res.data;
        this.totalItems = this.allData.length;
      },

      error: () => {
        this.loading = false;
      }
    })
  }
}