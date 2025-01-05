import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Globals } from './class/globals';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    loading: boolean = true;
    constructor(
        private primengConfig: PrimeNGConfig,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;


    }
}
