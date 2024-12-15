import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
    providedIn: 'root',
})
export class AllEmployeeFingerPrintsService extends LockupsService {

    constructor(http: HttpClient) {
        super(http);
    }

    getDropDown(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
        );
    }

    getDropDownManager(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Employee/GetMangerDropDown/?culture=${this.culture}`
        );
    }

    getShiftById(id: number): Observable<any> {
        return this.http.get(`${this.baseurl}/shift/${id}`);
    }

    // dropdown of getting Partations by department
    getPartationByDepartmentId(id: number): Observable<any> {
        return this.http.get(`${this.baseurl}/Partation/GetByDepartmentId?DepartmentId=${id}`);
    }

    // dropdown of getting Employees By Manager
    GetEmployeeOfMangerDropDown(id: number): Observable<any> {
        return this.http.get(`${this.baseurl}/Employee/GetEmployeeOfMangerDropDown?MangerId=${id}`);
    }

    override GetPage(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/GetEmployeeFingerprint/?culture=${this.culture}`,
            body
        );
    }

}
