import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
    providedIn: 'root',
})
export class SendToAllServiceService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }

    SendNotificationToAll(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/SendNotificationToAll?culture=${this.culture}`,
            body
        );
    }
}
