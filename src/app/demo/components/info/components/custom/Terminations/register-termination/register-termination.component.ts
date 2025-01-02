import { Component, Input } from '@angular/core';
import { RegisterTerminationService } from './register-termination.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-register-termination',
  standalone: true,
  imports: [GlobalsModule, PrimeNgModule],
  templateUrl: './register-termination.component.html',
  styleUrl: './register-termination.component.scss',
  providers: [DatePipe]
})

export class RegisterTerminationComponent {

  loading: boolean = false;
  selectedEmployeeId: any[] = [];
  dropdownItemsEmployee: any;


  constructor(
    private _RegisterTerminationService: RegisterTerminationService,
    private messageService: MessageService,
    private DatePipe: DatePipe,
  ) { }
  @Input() endPoint!: string;

  TerminationForm: FormGroup = new FormGroup({
    EmployeeId: new FormControl(null, [Validators.required]),
    TerminationDate: new FormControl(null, [Validators.required]),
    LastWorkingDate: new FormControl(null, [Validators.required]),
    Reason: new FormControl(null, [Validators.required]),
    ClearanceDate: new FormControl(null, [Validators.required]),
  });

  ngOnInit() {
    this.endPoint = 'Termination';

    // adding this Configurations in each Component Customized
    Globals.getMainLangChanges().subscribe((mainLang) => {
      console.log('Main language changed to:', mainLang);

      // update mainLang at Service
      this._RegisterTerminationService.setCulture(mainLang);

      // update endpoint
      this._RegisterTerminationService.setEndPoint(this.endPoint);


      // get all DropDowns
      this.getALlDropDown();
    });
  }

  getDropDownField(self: { field: any; enum: string }) {
    this._RegisterTerminationService.getDropdownField(self.enum).subscribe({
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


  onSelectEmployee(event: any) {
    console.log(event);
    this.selectedEmployeeId = event.value.id;
  }


  getDecodedToken() {
    const token = localStorage.getItem('userToken'); // Replace with your token key
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded; // Return the decoded token
      } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
      }
    }
    return null;
  }

  getPropertyFromToken(property: string) {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken[property] : null; // Extract the desired property
  }


  mapToFormData(body: any) {
    const formData: FormData = new FormData();

    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        formData.append(key, body[key]);
      }
    }

    return formData;
  }

  registerTermination(form: FormGroup) {
    if (form.valid) {
      this.loading = true;

      let body = {
        ...form.value,

        EmployeeId: this.selectedEmployeeId,
        HrId: Number(this.getPropertyFromToken("EmployeeId")),
        TerminationDate: this.DatePipe.transform(
          this.TerminationForm.get('TerminationDate').value,
          'yyyy-MM-dd'
        ),
        LastWorkingDate: this.DatePipe.transform(
          this.TerminationForm.get('LastWorkingDate').value,
          'yyyy-MM-dd'
        ),
        ClearanceDate: this.DatePipe.transform(
          this.TerminationForm.get('ClearanceDate').value,
          'yyyy-MM-dd'
        ),
      }


      const formData = this.mapToFormData(body);


      this._RegisterTerminationService
        .RegisterTermination(formData)
        .subscribe({
          next: (res) => {
            this.loading = false;

            if (res.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Termination sent successfully !',
                life: 3000,
              });

              form.reset();
            }
          },
          error: () => {
            this.loading = false;
          }

        });
    }
  }
}
