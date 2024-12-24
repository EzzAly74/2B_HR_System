import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LockupsService {
    baseurl: string;
    endPoint: string;
    culture: string;

    constructor(protected http: HttpClient) {
        this.baseurl = environment.baseurl;
    }

    setEndPoint(val: string) {
        this.endPoint = val;
    }

    setCulture(val: string) {
        this.culture = val;
    }

    GetById(id: number): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${this.endPoint}/${id}/?culture=${this.culture}`
        );
    }

    GetAll(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/?culture=${this.culture}`,
            body
        );
    }

    GetPage(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/?culture=${this.culture}`,
            body
        );
    }

    Register(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/register/?culture=${this.culture}`,
            body
        );
    }

    Edit(body: any): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/Edit/?culture=${this.culture}`,
            body
        );
    }

    DeleteSoftById(id: number): Observable<any> {
        return this.http.delete(
            `${this.baseurl}/${this.endPoint}/DeleteSoftById/${id}/?culture=${this.culture}`
        );
    }

    deleteById(id: number): Observable<any> {
        return this.http.delete(
            `${this.baseurl}/${this.endPoint}/${id}/?culture=${this.culture}`
        );
    }

    DeleteRangeSoft(body: number[]): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/DeleteRangeSoft/?culture=${this.culture}`,
            body
        );
    }

    getDropdown(): Observable<any> {
        return this.http.get(
            `${this.baseurl}/${this.endPoint}/getDropDown/?culture=${this.culture}`
        );
    }

    DeleteRange(body: number[]): Observable<any> {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/DeleteRange/?culture=${this.culture}`,
            body
        );
    }
    importExcel(body: any) {
        return this.http.post(
            `${this.baseurl}/${this.endPoint}/ImportExcel`,
            body
        );
    }
}
