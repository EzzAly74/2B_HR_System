import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
  providedIn: 'root'
})
export class CalculateMonthSalaryService extends LockupsService {
  constructor(http: HttpClient) {
    super(http);
  }

  getDropdownField(field: any): Observable<any> {
    return this.http.get(
      `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
    );
  }



  calculateMonthSalary(month: number, year: number) {
    const params = new HttpParams().set("month", month).set("year", year);
    return this.http.get(`${this.baseurl}/Salary/${this.endPoint}`, { params });
  }



}