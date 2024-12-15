import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
  providedIn: 'root'
})
export class ResignationSettingService extends LockupsService {

  constructor(http:HttpClient) {
    super(http);
   }

   getForDashboard(): Observable<any> {
      return this.http.get(
          `${this.baseurl}/${this.endPoint}/GetForDashboard`
      );
    }

    
   register(body: any): Observable<any>{
    return this.http.post(
        `${this.baseurl}/${this.endPoint}/register`,
        body
    );
  }
}
