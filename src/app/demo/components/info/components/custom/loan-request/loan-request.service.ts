import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LockupsService } from 'src/app/demo/service/lockups.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class LoanRequestService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }

    getDropdownEnum(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Enums/${field}/?culture=${this.culture}`
        );
    }

    getDropdownField(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
        );
    }
    updateRequestType(body: any) {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/Accept/?culture=${this.culture}`,
            body
        );
    }
}
