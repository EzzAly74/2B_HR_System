import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';
@Injectable({
    providedIn: 'root',
})
export class SetAssetCoordinatorService extends LockupsService {
    constructor(http: HttpClient) {
        super(http);
    }

    getDropdownField(field: any, id?: number): Observable<any> {
        if (id) {
            return this.http.get(
                `${this.baseurl}/${field}/getDropDown/?CategoryId=${id}&culture=${this.culture}`
            );
        } else {
            return this.http.get(
                `${this.baseurl}/${field}/getDropDown/?culture=${this.culture}`
            );
        }
    }

    registerRange(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/AssetCoordinator/RegisterRange?culture=${this.culture}`,
            body
        );
    }
}
