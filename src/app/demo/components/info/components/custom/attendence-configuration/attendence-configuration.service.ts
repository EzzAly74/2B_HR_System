import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
    providedIn: 'root',
})
export class AttendenceConfigurationService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }
    getDropdownEnum(field: string): Observable<any> {
        return this.http.get(
            `${this.baseurl}/Enums/${field}/?culture=${this.culture}`
        );
    }
}