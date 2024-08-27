import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
  providedIn: 'root'
})
export class AllEmployeeManagerService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }

    getDropDownManager(field: string) {
        return this.http.get(`${this.baseurl}/${field}/GetMangerDropDown`);
    }

    getDropDown(field: string) {
        return this.http.get(`${this.baseurl}/${field}/getDropDown`);
    }

}
