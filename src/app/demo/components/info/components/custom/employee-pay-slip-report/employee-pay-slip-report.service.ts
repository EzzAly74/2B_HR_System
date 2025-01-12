import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
    providedIn: 'root',
})
export class EmployeePaySlipReportService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }
    getMonths(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Enums/getMonth/?culture=${this.culture}`
        );
    }
    getDropdownField(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
        );
    }

    override GetPage(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/EmployeePaySlipReport/?culture=${this.culture}`,
            body
        );
    }
}
