import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';
@Injectable({
    providedIn: 'root',
})
export class ResignationPolicyService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }
    override GetAll(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${this.endPoint}/?culture=${this.culture}`
        );
    }
}
