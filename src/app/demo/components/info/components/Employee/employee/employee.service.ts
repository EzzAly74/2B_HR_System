import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LockupsService } from 'src/app/demo/service/lockups.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends LockupsService {

  constructor(httpClient: HttpClient) {
      super(httpClient);
  }
}
