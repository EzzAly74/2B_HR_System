import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';
@Injectable({
    providedIn: 'root',
})
export class InsuranceConfigService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }
    override DeleteSoftById(id: number): Observable<any> {
        return this.http.delete(
            `${this.baseurl}/${this.endPoint}/${id}/?culture=${this.culture}`
        );
    }
}
