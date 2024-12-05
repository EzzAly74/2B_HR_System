import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../service/app.layout.service';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/class/globals';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserDataService } from './user-data.service';
import { environment } from 'src/environments/environment';
import { EmployeeEditService } from 'src/app/demo/components/info/components/employee-edit/employee-edit.service';
import { authGuard } from 'src/app/demo/components/auth/auth.guard';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss'],
})
export class AppTopBarComponent implements OnInit {
    constructor(
        public layoutService: LayoutService,
        private translate: TranslateService,
        private router: Router,
        private userDataService: UserDataService
    ) {}
    countries: any[] | undefined;

    selectedCountry: string | undefined;
    lang: any;
    langData: any;
    themeSelected: any;
    decodedUserToken!: any;
    mediaUrl: string = environment.mediaUrl;
    imageUrl: string = '';
    userName: string = '';

    ngOnInit() {
        const lang = localStorage.getItem('currentLang')
            ? localStorage.getItem('currentLang')
            : 'ar';

        console.log(this.imageUrl);

        const userToken = localStorage.getItem('userToken');

        if (userToken) this.decodedUserToken = jwtDecode(userToken);

        this.countries = [
            { name: 'العربية', code: 'EG', lang: 'ar' },
            { name: 'English', code: 'US', lang: 'en' },
        ];

        // for arabic
        // this.translate.setDefaultLang('ar');
        // document.dir = 'rtl';
        // document.documentElement.lang = 'ar';
        this.selectedCountry = this.countries[0];

        // for english
        // this.translate.setDefaultLang('en');
        // document.dir = 'ltr';
        // document.documentElement.lang = 'en';
        // this.selectedCountry = this.countries[1];
        if (lang == 'ar' || lang == null) {
            this.translate.use('ar');
            Globals.setMainLang('ar');
            document.dir = 'rtl'; // Default to 'ltr' if dir is undefined
            document.documentElement.lang = 'ar';
            this.selectedCountry = this.countries[0];
        } else if (lang == 'en') {
            this.translate.use('en');
            Globals.setMainLang('en');
            document.dir = 'ltr'; // Default to 'ltr' if dir is undefined
            document.documentElement.lang = 'en';
            this.selectedCountry = this.countries[1];
        }
        this.theme = localStorage.getItem('theme');

        localStorage.setItem('theme', 'saga-orange');

        if (this.theme == 'arya-orange') {
            this.themeSelected = true;
        } else {
            this.themeSelected = false;
        }

        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);
            this.getUserData(mainLang);
        });
      
    }
    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }
    get theme(): string {
        return this.layoutService.config().theme;
    }
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    signOut() {
        localStorage.removeItem('userToken');
        this.router.navigate(['/auth/login']);
    }

    changeThemeFun() {
        if (this.theme == 'saga-orange') {
            localStorage.setItem('theme', 'arya-orange');
            this.theme = 'arya-orange';
            this.themeSelected = false;
        } else {
            this.theme = 'saga-orange';
            localStorage.setItem('theme', 'saga-orange');
            this.themeSelected = true;
        }

        console.log(this.themeSelected);
    }

    changeLang(event: any) {
        const lang = event.value.lang;

        localStorage.setItem('currentLang', lang);
        // this.translate.use(lang);

        this.translate.use(lang).subscribe(() => {
            const langData = this.translate.translations[lang];

            console.log(langData);
            if (langData) {
                this.translate.use(lang);
                document.dir = langData.DIR; // Default to 'ltr' if dir is undefined
                document.documentElement.lang = langData.lang; // Default to lang if lang is undefined
            }

            // set lang at Globals
            Globals.setMainLang(lang);
        });
    }
    getUserData(lang: string) {
        if (this.decodedUserToken)
            this.userDataService
                .getUserData(this.decodedUserToken.EmployeeId)
                .subscribe({
                    next: (res) => {
                        if (res.data) {
                            console.log("Start All Data From Here")
                            console.log(res.data);
                            console.log("End All Data From Here")
                            if (res.data.imageUrl)
                                this.imageUrl = `${this.mediaUrl}/${res.data.imageUrl}`;

                            if(lang == 'ar')
                                this.userName = res.data.nameAr;
                            else
                                this.userName = res.data.englishName;
                            // alert(this.userName)
                        }
                    }
                });
    }
}
