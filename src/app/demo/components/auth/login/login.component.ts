import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/class/globals';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    loginForm: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required]),
    });
    valCheck: string[] = ['remember'];

    password!: string;
    theme: string;
    loading: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
        private translate: TranslateService
    ) { }




    ngOnInit() {
        const lang = localStorage.getItem('currentLang');

        if (lang == 'en') {
            this.translate.use('en');
            Globals.setMainLang('en');
            document.dir = 'ltr'; // Default to 'ltr' if dir is undefined
            document.documentElement.lang = 'en';
        }
        else {
            this.translate.use('ar');
            Globals.setMainLang('ar');
            document.dir = 'rtl'; // Default to 'ltr' if dir is undefined
            document.documentElement.lang = 'ar';
        }

        // Globals.getMainLangChanges().subscribe({
        //     next: (lang) => {
        //         this.translate.use(lang).subscribe(() => {
        //             const langData = this.translate.translations[lang];
        //             this.authService.setCulture(lang);

        //             console.log(langData);
        //             if (langData) {
        //                 this.translate.use(lang);
        //                 document.dir = langData.DIR; // Default to 'ltr' if dir is undefined
        //                 document.documentElement.lang = langData.lang; // Default to lang if lang is undefined
        //             }
        //         });
        //     },
        // });
        this.theme = localStorage.getItem('theme')
            ? localStorage.getItem('theme')
            : 'saga-orange';
    }

    submitLoginForm(logForm: FormGroup) {
        if (logForm.valid) {
            this.loading = true
            this.authService.login(logForm.value).subscribe({
                next: (res) => {
                    this.loading = false;
                    if (res.data && res.statusCode == 200 && res.success) {
                        localStorage.setItem('userToken', res.data.token);
                        this.router.navigate(['/dashboard']);
                    }

                    console.log(res);


                },

            });
        }
    }
}
