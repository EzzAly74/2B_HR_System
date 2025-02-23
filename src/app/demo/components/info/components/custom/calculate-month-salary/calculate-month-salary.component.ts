import { Component } from '@angular/core';
import { CalculateMonthSalaryService } from './calculate-month-salary.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculate-month-salary',
  standalone: true,
  imports: [GlobalsModule, PrimeNgModule],
  providers: [MessageService, TranslateService],
  templateUrl: './calculate-month-salary.component.html',
  styleUrl: './calculate-month-salary.component.scss'
})
export class CalculateMonthSalaryComponent {
  constructor(
    private CalculateMonthSalaryService: CalculateMonthSalaryService,
    private messageService: MessageService,
    private translate: TranslateService
  ) { }
  dropdownItemsDepartment: any;
  dropdownItemsEmployee: any;

  loading: boolean = false;
  selectedDepartment: any;
  selectedShift: any;
  selectedEmployee: any;
  selectedEmployeeIds: any[] = [];
  items: any;
  endPoint: string;

  selectedMonth: any;
  selectedYear: any;
  YearsDropDown: any;
  MonthsDropDown: any;


  calculateMonthForm: FormGroup = new FormGroup({
    month: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(12),
    ]),
    year: new FormControl(null, [
      Validators.required,
      Validators.min(2000),
      Validators.max(2199),
    ]),
  });

  ngOnInit(): void {
    this.endPoint = 'CalculateMonthSalary';

    // adding this Configurations in each Component Customized
    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);

      // update mainLang at Service
      this.CalculateMonthSalaryService.setCulture(mainLang);

      // update endpoint
      this.CalculateMonthSalaryService.setEndPoint(this.endPoint);

      // update breadcrumb
      this.translate.onLangChange.subscribe(() => {
        this.updateTranslations();
      });


      this.setDropDowns()

      this.updateTranslations();
    });
  }


  setDropDowns(lang: string = "ar") {
    // set Years Dropdown: 
    const currentYear = new Date().getFullYear();

    this.YearsDropDown = [
      { id: currentYear - 1, name: currentYear - 1 },
      { id: currentYear, name: currentYear },
      { id: currentYear + 1, name: currentYear + 1 },
    ]

    // set Months DropDown:
    const months_En = [
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" }
    ];

    const months_Ar = [
      { id: 1, name: "يناير" },
      { id: 2, name: "فبراير" },
      { id: 3, name: "مارس" },
      { id: 4, name: "أبريل" },
      { id: 5, name: "مايو" },
      { id: 6, name: "يونيو" },
      { id: 7, name: "يوليو" },
      { id: 8, name: "أغسطس" },
      { id: 9, name: "سبتمبر" },
      { id: 10, name: "أكتوبر" },
      { id: 11, name: "نوفمبر" },
      { id: 12, name: "ديسمبر" }
    ];

    if (lang == "en")
      this.MonthsDropDown = months_En;
    else
      this.MonthsDropDown = months_Ar;
  }

  getDropDownField(self: { field: any; enum: string; id?: number }) {
    this.loading = true;
    this.CalculateMonthSalaryService.getDropdownField(self.enum).subscribe({
      next: (res) => {
        this.loading = false;
        this[self.field] = res.data;
      },
      error: (err) => {
        this.loading = true;
        console.log(`error in ${self.field}`);
        console.log(err);
      },
    });
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
        label: this.translate.instant(`breadcrumb.cats.manageStructure.items.${this.endPoint}`),
      }];
  }


  onSelectEmployees(event: any) {
    this.selectedEmployee = event.value;
    this.selectedEmployeeIds = [];
    event.value.forEach((employee: any) => {
      this.selectedEmployeeIds.push(employee.employeeId);
    });
    console.log('Selected Employees:', this.selectedEmployeeIds);
  }

  registerSubmit(form: FormGroup) {

    this.loading = true;

    if (form.valid) {
      const { month, year } = form.value; // Extract values

      // Call the service with the extracted values
      this.CalculateMonthSalaryService.calculateMonthSalary(month, year).subscribe({
        next: (res) => {
          console.log(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Month Salary calculated  successfully',
            life: 3000,
          });
          this.loading = false
        },
        error: (err) => {
          console.log(err);
          this.loading = false
        },
      });
    }
  }
}
