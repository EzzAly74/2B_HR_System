import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserDataService extends LockupsService {
    baseUrl: string = environment.baseurl;
    constructor(http: HttpClient) {
        super(http);
    }
    getUserData(userId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/Employee/${userId}/?culture=${this.culture}`);
    }
}
