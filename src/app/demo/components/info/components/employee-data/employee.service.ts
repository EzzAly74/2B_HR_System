import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
    providedIn: 'root',
})
export class EmployeeService extends LockupsService {
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    getEnum(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Enums/${field}/?culture=${this.culture}`
        );
    }

    getDropdownField(field: any): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
        );
    }

    resetMacAddress(id: number) {
        return this.http.post(
            `${this.baseurl}/Employee/ResetMacAddres?Employeeid=${id}`,
            {}
        );
    }
}
