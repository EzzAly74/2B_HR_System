import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
    providedIn: 'root',
})
export class ExecuseRequestService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }
    getRequestTypeDropdown(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Enums/getRequestType/?culture=${this.culture}`
        );
    }

    changeStatus(body: any): Observable<any> {
        return this.http.post(`${this.baseurl}/${this.endPoint}/UpdateRequestType`, body);
    }
    getDropdownField(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
        );
    }
    addExecuseRequest(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/AddRequest`,
            body
        );
    }
    deleteExecuseRequestById(id: number): Observable<any> {
        return this.http.delete(`${this.baseurl}/${this.endPoint}/${id}`);
    }
    getManagerDropdown(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Employee/GetMangerDropDown/?culture=${this.culture}`
        );
    }
}
