import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LockupsService } from 'src/app/demo/service/lockups.service';
@Injectable({
    providedIn: 'root',
})
export class LoanSettingsService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }
}
