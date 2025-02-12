import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
  providedIn: 'root'
})
export class GetLoanPaymentDetailsService extends LockupsService {
  constructor(http: HttpClient) {
    super(http);
  }

  getDropdownField(field: any): Observable<any> {
    return this.http.get(
      `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
    );
  }

  getLoanPayment(employeeId: number) {
    return this.http.get(
      `${this.baseurl}/LoanPayment/GetLoanDetailsByEmployeeID/${employeeId}`
    );
  }




}