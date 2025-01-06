import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
  providedIn: 'root'
})
export class HrLetterService extends LockupsService {
  constructor(http: HttpClient) {
    super(http);
  }

  changeStatus(body: any): Observable<any> {
    return this.http.post(`${this.baseurl}/${this.endPoint}/HRAccept`, body);
  }
}
