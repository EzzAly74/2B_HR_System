import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
    providedIn: 'root',
})
export class ExternalMissonService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }

    getRequestTypeDropdown(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Enums/getRequestType/?culture=${this.culture}`
        );
    }
    getMissionTypeDropdown(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Enums/getMissionType/?culture=${this.culture}`
        );
    }
    getManagerDropdown(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Employee/GetMangerDropDown/?culture=${this.culture}`
        );
    }
    addExternalMissonRequest(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/AddRequest`,
            body
        );
    }
    getDropdownField(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
        );
    }
    deleteExternalMissonById(id: number): Observable<any> {
        return this.http.delete(`${this.baseurl}/${this.endPoint}/${id}`);
    }
}
