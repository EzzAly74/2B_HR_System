import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
  providedIn: 'root'
})
export class GetLoanPaymentService extends LockupsService {
  constructor(http: HttpClient) {
    super(http);
  }

  getDropdownField(field: any): Observable<any> {
    return this.http.get(
      `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
    );
  }

  getLoanPayment(loanRequestId: number, employeeId: number) {
    return this.http.get(
      `${this.baseurl}/LoanPayment/GetLoanPayment?loanRequestId=${loanRequestId}&employeeId=${employeeId}&culture=${this.culture}`
    );
  }




}