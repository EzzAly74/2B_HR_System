import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss'],
})
export class AppMenuComponent implements OnInit {
    activeTabIndex: number | null = 0;
    model: any[] = [];
    constructor(
        public layoutService: LayoutService,
        private translate: TranslateService,
        private sanitizer: DomSanitizer
    ) { }

    toggleTab(index: number) {
        const selectedItem = this.model[index];
        if (selectedItem.type != 'h') {
            this.activeTabIndex = index;
        }
    }
    initMenuItems() {
        this.model = [
            {
                type: 'h',
                items: [
                    {
                        label: this.translate.instant('Overview'),
                        icon: 'pi pi-fw pi-home',
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                              <path d="M2.5 9.98478H9.16667V3.31812H2.5V9.98478ZM4.16667 4.98478H7.5V8.31812H4.16667V4.98478Z" fill="#2D3250"/>
                              <path d="M10.8333 3.31812V9.98478H17.5V3.31812H10.8333ZM15.8333 8.31812H12.5V4.98478H15.8333V8.31812Z" fill="#2D3250"/>
                              <path d="M2.5 18.3181H9.16667V11.6514H2.5V18.3181ZM4.16667 13.3181H7.5V16.6514H4.16667V13.3181Z" fill="#2D3250"/>
                              <path d="M15 11.6514H13.3333V14.1514H10.8333V15.8181H13.3333V18.3181H15V15.8181H17.5V14.1514H15V11.6514Z" fill="#2D3250"/>
                            </svg>
                          `),
                        items: [
                            {
                                label: this.translate.instant('DASHBOARD'),
                                routerLink: ['/dashboard'],
                            },
                            {
                                label: this.translate.instant('Users'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/users'],
                            },

                            // {
                            //     label: this.translate.instant('TESTINPUT'),
                            //     routerLink: ['/info/test'],
                            // },
                        ],
                    },

                    {
                        label: this.translate.instant('Payroll Overview'),
                        svg: this.sanitizer
                            .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M16.6667 4.15145H3.33333C2.40833 4.15145 1.675 4.89312 1.675 5.81812L1.66667 15.8181C1.66667 16.7431 2.40833 17.4848 3.33333 17.4848H16.6667C17.5917 17.4848 18.3333 16.7431 18.3333 15.8181V5.81812C18.3333 4.89312 17.5917 4.15145 16.6667 4.15145ZM16.6667 15.8181H3.33333V10.8181H16.6667V15.8181ZM16.6667 7.48478H3.33333V5.81812H16.6667V7.48478Z" fill="#2D3250"/>
                            </svg>`),
                        items: [
                            {
                                label: this.translate.instant(
                                    'Penalties & Deductions'
                                ),
                                routerLink: ['/info/PenaltiesAndDeduction'],
                            },
                            {
                                label: this.translate.instant('Bonuses'),
                                routerLink: ['/info/bonus'],
                            },
                            {
                                label: this.translate.instant('KPIs'),
                                routerLink: ['/info/kpi'],
                            },
                            {
                                label: this.translate.instant('ALLOWANCE'),
                                routerLink: ['/info/allowance'],
                            },
                            {
                                label: this.translate.instant(
                                    'Month End Closure'
                                ),
                                routerLink: ['/info/closeMonth'],
                            },
                        ],
                    },

                    {
                        label: this.translate.instant('Employees Profiles'),
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M10 0.818115C4.48 0.818115 0 5.29812 0 10.8181C0 16.3381 4.48 20.8181 10 20.8181C15.52 20.8181 20 16.3381 20 10.8181C20 5.29812 15.52 0.818115 10 0.818115ZM5.35 17.3181C6.66 16.3781 8.26 15.8181 10 15.8181C11.74 15.8181 13.34 16.3781 14.65 17.3181C13.34 18.2581 11.74 18.8181 10 18.8181C8.26 18.8181 6.66 18.2581 5.35 17.3181ZM16.14 15.9381C14.45 14.6181 12.32 13.8181 10 13.8181C7.68 13.8181 5.55 14.6181 3.86 15.9381C2.7 14.5481 2 12.7681 2 10.8181C2 6.39812 5.58 2.81812 10 2.81812C14.42 2.81812 18 6.39812 18 10.8181C18 12.7681 17.3 14.5481 16.14 15.9381Z" fill="#2D3250"/>
                            <path d="M10 4.81812C8.07 4.81812 6.5 6.38812 6.5 8.31812C6.5 10.2481 8.07 11.8181 10 11.8181C11.93 11.8181 13.5 10.2481 13.5 8.31812C13.5 6.38812 11.93 4.81812 10 4.81812ZM10 9.81812C9.17 9.81812 8.5 9.14812 8.5 8.31812C8.5 7.48812 9.17 6.81812 10 6.81812C10.83 6.81812 11.5 7.48812 11.5 8.31812C11.5 9.14812 10.83 9.81812 10 9.81812Z" fill="#2D3250"/>
                            </svg>
                            `),
                        items: [
                            {
                                label: this.translate.instant('Employees'),
                                routerLink: ['/info/employees'],
                            },
                            {
                                label: this.translate.instant(
                                    'Employees Files'
                                ),
                                routerLink: ['/info/allEmployeesFile'],
                            },
                            {
                                label: this.translate.instant(
                                    'Employees Assets'
                                ),
                                routerLink: ['/info/allEmployeesCovenant'],
                            },

                            {
                                label: this.translate.instant(
                                    'Employees Managers'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/allEmployeesManager'],
                            },

                            {
                                label: this.translate.instant(
                                    'Employees Fingerprints'
                                ),
                                routerLink: ['/info/fingerprints'],
                            },

                            {
                                label: this.translate.instant(
                                    'Employees Locations'
                                ),
                                routerLink: ['/info/allEmployeesLocation'],
                            },

                            {
                                label: this.translate.instant(
                                    'MONTHLYALLOWANCE'
                                ),
                                routerLink: ['/info/monthlyAllowance'],
                            },

                            {
                                label: this.translate.instant(
                                    'Employees Shifts'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/setEmployeeShifts'],
                            },

                            {
                                label: this.translate.instant(
                                    'Assets Coordinator'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/setAssetCoordinator'],
                            },

                            {
                                label: this.translate.instant(
                                    'Employees Uniform'
                                ),
                                routerLink: ['/info/allEmployeesUniform'],
                            },

                            {
                                label: this.translate.instant(
                                    'Add New Employee'
                                ),
                                routerLink: ['/info/employee'],
                            },
                        ],
                    },
                    {
                        label: this.translate.instant('Manage Requests'),
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M13.75 16.4333H3.75V6.25H9.58333V4.58333H3.75C2.83333 4.58333 2.08333 5.33333 2.08333 6.25V16.25C2.08333 17.1667 2.83333 17.9167 3.75 17.9167H13.75C14.6667 17.9167 15.4167 17.1667 15.4167 16.25V10.4167H13.75V16.4333Z" fill="#2D3250"/>
                            <path d="M15.4167 2.08333H13.75V4.58333H11.25C11.2583 4.59167 11.25 6.25 11.25 6.25H13.75V8.74166C13.7583 8.75 15.4167 8.74166 15.4167 8.74166V6.25H17.9167V4.58333H15.4167V2.08333Z" fill="#2D3250"/>
                            <path d="M12.0833 7.91667H5.41667V9.58333H12.0833V7.91667Z" fill="#2D3250"/>
                            <path d="M5.41667 10.4167V12.0833H12.0833V10.4167H5.41667Z" fill="#2D3250"/>
                            <path d="M12.0833 12.9167H5.41667V14.5833H12.0833V12.9167Z" fill="#2D3250"/>
                            </svg>
                            `),
                        items: [
                            {
                                label: this.translate.instant(
                                    'Permissions Requests'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/execuseRequest'],
                            },
                            {
                                label: this.translate.instant(
                                    'Errands Requests'
                                ),
                                routerLink: ['/info/externalMisson'],
                            },
                            {
                                label: this.translate.instant(
                                    'Vacations Requests'
                                ),
                                routerLink: ['/info/vacationRequest'],
                            },
                            {
                                label: this.translate.instant(
                                    'Resignations Requests'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/resignation'],
                            },
                            {
                                label: this.translate.instant('Loan Requests'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/loanRequest'],
                            },
                        ],
                    },
                    {
                        label: this.translate.instant('Manage Types'),
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M16.1935 11.6348C16.2268 11.3681 16.2518 11.1014 16.2518 10.8181C16.2518 10.5348 16.2268 10.2681 16.1935 10.0014L17.9518 8.62645C18.1102 8.50145 18.1518 8.27645 18.0518 8.09311L16.3852 5.20978C16.3102 5.07645 16.1685 5.00145 16.0185 5.00145C15.9685 5.00145 15.9185 5.00978 15.8768 5.02645L13.8018 5.85978C13.3685 5.52645 12.9018 5.25145 12.3935 5.04312L12.0768 2.83478C12.0518 2.63478 11.8768 2.48478 11.6685 2.48478H8.33517C8.12684 2.48478 7.95184 2.63478 7.92684 2.83478L7.61017 5.04312C7.10184 5.25145 6.63517 5.53478 6.20184 5.85978L4.12684 5.02645C4.07684 5.00978 4.02684 5.00145 3.97684 5.00145C3.83517 5.00145 3.69351 5.07645 3.61851 5.20978L1.95184 8.09311C1.84351 8.27645 1.89351 8.50145 2.05184 8.62645L3.81017 10.0014C3.77684 10.2681 3.75184 10.5431 3.75184 10.8181C3.75184 11.0931 3.77684 11.3681 3.81017 11.6348L2.05184 13.0098C1.89351 13.1348 1.85184 13.3598 1.95184 13.5431L3.61851 16.4264C3.69351 16.5598 3.83517 16.6348 3.98517 16.6348C4.03517 16.6348 4.08517 16.6265 4.12684 16.6098L6.20184 15.7764C6.63517 16.1098 7.10184 16.3848 7.61017 16.5931L7.92684 18.8014C7.95184 19.0015 8.12684 19.1514 8.33517 19.1514H11.6685C11.8768 19.1514 12.0518 19.0015 12.0768 18.8014L12.3935 16.5931C12.9018 16.3848 13.3685 16.1014 13.8018 15.7764L15.8768 16.6098C15.9268 16.6265 15.9768 16.6348 16.0268 16.6348C16.1685 16.6348 16.3102 16.5598 16.3852 16.4264L18.0518 13.5431C18.1518 13.3598 18.1102 13.1348 17.9518 13.0098L16.1935 11.6348ZM14.5435 10.2098C14.5768 10.4681 14.5852 10.6431 14.5852 10.8181C14.5852 10.9931 14.5685 11.1764 14.5435 11.4264L14.4268 12.3681L15.1685 12.9514L16.0685 13.6514L15.4852 14.6598L14.4268 14.2348L13.5602 13.8848L12.8102 14.4514C12.4518 14.7181 12.1102 14.9181 11.7685 15.0598L10.8852 15.4181L10.7518 16.3598L10.5852 17.4848H9.41851L9.12684 15.4181L8.24351 15.0598C7.88517 14.9098 7.55184 14.7181 7.21851 14.4681L6.46017 13.8848L5.57684 14.2431L4.51851 14.6681L3.93517 13.6598L4.83517 12.9598L5.57684 12.3764L5.46017 11.4348C5.43517 11.1764 5.41851 10.9848 5.41851 10.8181C5.41851 10.6514 5.43517 10.4598 5.46017 10.2098L5.57684 9.26812L4.83517 8.68478L3.93517 7.98478L4.51851 6.97645L5.57684 7.40145L6.44351 7.75145L7.19351 7.18478C7.55184 6.91812 7.89351 6.71812 8.23517 6.57645L9.11851 6.21812L9.25184 5.27645L9.41851 4.15145H10.5768L10.8685 6.21812L11.7518 6.57645C12.1102 6.72645 12.4435 6.91812 12.7768 7.16812L13.5352 7.75145L14.4185 7.39312L15.4768 6.96812L16.0602 7.97645L15.1685 8.68478L14.4268 9.26812L14.5435 10.2098ZM10.0018 7.48478C8.16017 7.48478 6.66851 8.97645 6.66851 10.8181C6.66851 12.6598 8.16017 14.1514 10.0018 14.1514C11.8435 14.1514 13.3352 12.6598 13.3352 10.8181C13.3352 8.97645 11.8435 7.48478 10.0018 7.48478ZM10.0018 12.4848C9.08517 12.4848 8.33517 11.7348 8.33517 10.8181C8.33517 9.90145 9.08517 9.15145 10.0018 9.15145C10.9185 9.15145 11.6685 9.90145 11.6685 10.8181C11.6685 11.7348 10.9185 12.4848 10.0018 12.4848Z" fill="#2D3250"/>
                            </svg>
                            `),
                        items: [
                            {
                                label: this.translate.instant(
                                    'Permissions Types'
                                ),
                                routerLink: ['/info/execuseType'],
                            },
                            {
                                label: this.translate.instant(
                                    'Vacations Types'
                                ),
                                routerLink: ['/info/vacationType'],
                            },
                            {
                                label: this.translate.instant(
                                    'Official Holidays'
                                ),
                                routerLink: ['/info/publicVacation'],
                            },
                            {
                                label: this.translate.instant('Shifts Types'),
                                routerLink: ['/info/shift'],
                            },
                            {
                                label: this.translate.instant(
                                    'Vacations Shift Types'
                                ),
                                routerLink: ['/info/shiftVacation'],
                            },
                            {
                                label: this.translate.instant('Loan Types'),
                                routerLink: ['/info/loanTypes'],
                            },
                        ],
                    },


                    {
                        label: this.translate.instant('Terminations'),
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M16.1935 11.6348C16.2268 11.3681 16.2518 11.1014 16.2518 10.8181C16.2518 10.5348 16.2268 10.2681 16.1935 10.0014L17.9518 8.62645C18.1102 8.50145 18.1518 8.27645 18.0518 8.09311L16.3852 5.20978C16.3102 5.07645 16.1685 5.00145 16.0185 5.00145C15.9685 5.00145 15.9185 5.00978 15.8768 5.02645L13.8018 5.85978C13.3685 5.52645 12.9018 5.25145 12.3935 5.04312L12.0768 2.83478C12.0518 2.63478 11.8768 2.48478 11.6685 2.48478H8.33517C8.12684 2.48478 7.95184 2.63478 7.92684 2.83478L7.61017 5.04312C7.10184 5.25145 6.63517 5.53478 6.20184 5.85978L4.12684 5.02645C4.07684 5.00978 4.02684 5.00145 3.97684 5.00145C3.83517 5.00145 3.69351 5.07645 3.61851 5.20978L1.95184 8.09311C1.84351 8.27645 1.89351 8.50145 2.05184 8.62645L3.81017 10.0014C3.77684 10.2681 3.75184 10.5431 3.75184 10.8181C3.75184 11.0931 3.77684 11.3681 3.81017 11.6348L2.05184 13.0098C1.89351 13.1348 1.85184 13.3598 1.95184 13.5431L3.61851 16.4264C3.69351 16.5598 3.83517 16.6348 3.98517 16.6348C4.03517 16.6348 4.08517 16.6265 4.12684 16.6098L6.20184 15.7764C6.63517 16.1098 7.10184 16.3848 7.61017 16.5931L7.92684 18.8014C7.95184 19.0015 8.12684 19.1514 8.33517 19.1514H11.6685C11.8768 19.1514 12.0518 19.0015 12.0768 18.8014L12.3935 16.5931C12.9018 16.3848 13.3685 16.1014 13.8018 15.7764L15.8768 16.6098C15.9268 16.6265 15.9768 16.6348 16.0268 16.6348C16.1685 16.6348 16.3102 16.5598 16.3852 16.4264L18.0518 13.5431C18.1518 13.3598 18.1102 13.1348 17.9518 13.0098L16.1935 11.6348ZM14.5435 10.2098C14.5768 10.4681 14.5852 10.6431 14.5852 10.8181C14.5852 10.9931 14.5685 11.1764 14.5435 11.4264L14.4268 12.3681L15.1685 12.9514L16.0685 13.6514L15.4852 14.6598L14.4268 14.2348L13.5602 13.8848L12.8102 14.4514C12.4518 14.7181 12.1102 14.9181 11.7685 15.0598L10.8852 15.4181L10.7518 16.3598L10.5852 17.4848H9.41851L9.12684 15.4181L8.24351 15.0598C7.88517 14.9098 7.55184 14.7181 7.21851 14.4681L6.46017 13.8848L5.57684 14.2431L4.51851 14.6681L3.93517 13.6598L4.83517 12.9598L5.57684 12.3764L5.46017 11.4348C5.43517 11.1764 5.41851 10.9848 5.41851 10.8181C5.41851 10.6514 5.43517 10.4598 5.46017 10.2098L5.57684 9.26812L4.83517 8.68478L3.93517 7.98478L4.51851 6.97645L5.57684 7.40145L6.44351 7.75145L7.19351 7.18478C7.55184 6.91812 7.89351 6.71812 8.23517 6.57645L9.11851 6.21812L9.25184 5.27645L9.41851 4.15145H10.5768L10.8685 6.21812L11.7518 6.57645C12.1102 6.72645 12.4435 6.91812 12.7768 7.16812L13.5352 7.75145L14.4185 7.39312L15.4768 6.96812L16.0602 7.97645L15.1685 8.68478L14.4268 9.26812L14.5435 10.2098ZM10.0018 7.48478C8.16017 7.48478 6.66851 8.97645 6.66851 10.8181C6.66851 12.6598 8.16017 14.1514 10.0018 14.1514C11.8435 14.1514 13.3352 12.6598 13.3352 10.8181C13.3352 8.97645 11.8435 7.48478 10.0018 7.48478ZM10.0018 12.4848C9.08517 12.4848 8.33517 11.7348 8.33517 10.8181C8.33517 9.90145 9.08517 9.15145 10.0018 9.15145C10.9185 9.15145 11.6685 9.90145 11.6685 10.8181C11.6685 11.7348 10.9185 12.4848 10.0018 12.4848Z" fill="#2D3250"/>
                            </svg>
                            `),
                        items: [
                            {
                                label: this.translate.instant(
                                    'registerTermination'
                                ),
                                routerLink: ['/info/registerTermination'],
                            },
                            {
                                label: this.translate.instant(
                                    'allTerminations'
                                ),
                                routerLink: ['/info/allTerminations'],
                            },
                            {
                                label: this.translate.instant(
                                    'hrLetter'
                                ),
                                routerLink: ['/info/hrLetter'],
                            },
                        ],
                    },


                    {
                        label: this.translate.instant('Manage Structure'),
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M10.8333 19.1515H17.5V13.3181H15V9.98478H10.8333V8.31812H13.3333V2.48478H6.66667V8.31812H9.16667V9.98478H5V13.3181H2.5V19.1515H9.16667V13.3181H6.66667V11.6515H13.3333V13.3181H10.8333V19.1515ZM8.33333 6.65145V4.15145H11.6667V6.65145H8.33333ZM7.5 14.9848V17.4848H4.16667V14.9848H7.5ZM15.8333 14.9848V17.4848H12.5V14.9848H15.8333Z" fill="#2D3250"/>
                            </svg>
                            `),
                        items: [
                            {
                                label: this.translate.instant('Governorates'),
                                routerLink: ['/info/government'],
                            },
                            {
                                label: this.translate.instant('Banks'),
                                routerLink: ['/info/bank'],
                            },
                            {
                                label: this.translate.instant('Departments'),
                                routerLink: ['/info/department'],
                            },
                            {
                                label: this.translate.instant(
                                    'Administrations'
                                ),
                                routerLink: ['/info/partition'],
                            },
                            {
                                label: this.translate.instant('Loan Policies'),
                                routerLink: ['/info/loanPolicy'],
                            },

                            {
                                label: this.translate.instant('Loan Settings'),
                                routerLink: ['/info/loanSettings'],
                            },
                            {
                                label: this.translate.instant('All Loans'),
                                routerLink: ['/info/loans'],
                            },
                            {
                                label: this.translate.instant(
                                    'Company Policies'
                                ),
                                routerLink: ['/info/companyPolicy'],
                            },

                            {
                                label: this.translate.instant(
                                    'COMPANYBASICDATA'
                                ),
                                routerLink: ['/info/companyBasicData'],
                            },

                            {
                                label: this.translate.instant('Locations'),
                                routerLink: ['/info/location'],
                            },

                            {
                                label: this.translate.instant(
                                    'Source of Employment'
                                ),
                                routerLink: ['/info/recuritmentSource'],
                            },
                            {
                                label: this.translate.instant('Jobs'),
                                routerLink: ['/info/job'],
                            },
                            {
                                label: this.translate.instant('Job Types'),
                                routerLink: ['/info/jobNature'],
                            },
                            {
                                label: this.translate.instant('Contracts'),
                                routerLink: ['/info/contractType'],
                            },
                            {
                                label: this.translate.instant(
                                    'Academic Degrees'
                                ),
                                routerLink: ['/info/grade'],
                            },
                            {
                                label: this.translate.instant('Qualifications'),
                                routerLink: ['/info/qualification'],
                            },
                            {
                                label: this.translate.instant(
                                    'Relative Relations'
                                ),
                                routerLink: ['/info/relativeRelation'],
                            },
                            {
                                label: this.translate.instant(
                                    'Uniform Guidelines'
                                ),
                                routerLink: ['/info/uniformCodes'],
                            },
                            {
                                label: this.translate.instant(
                                    'Insurance Types'
                                ),
                                routerLink: ['/info/insuranceConfig'],
                            },
                            {
                                label: this.translate.instant(
                                    'Company Assets Categories'
                                ),
                                routerLink: ['/info/CovenantCategory'],
                            },
                            {
                                label: this.translate.instant('Company Assets'),
                                routerLink: ['/info/Covenant'],
                            },
                            {
                                label: this.translate.instant(
                                    'Attendance Policy'
                                ),
                                routerLink: ['/info/attendenceConfig'],
                            },
                            {
                                label: this.translate.instant(
                                    'Vacation Policy'
                                ),
                                routerLink: ['/info/vacationSetting'],
                            },
                            {
                                label: this.translate.instant(
                                    'Resignation Settings'
                                ),
                                routerLink: ['/info/resignationPolicy'],
                            },
                            {
                                label: this.translate.instant('Net Income Tax'),
                                routerLink: ['/info/netIncomeTax'],
                            },
                            {
                                label: this.translate.instant('Tax Rate'),
                                routerLink: ['/info/taxRate'],
                            },
                            {
                                label: this.translate.instant('Internal Jobs'),
                                routerLink: ['/info/InternalJobs'],
                            },

                            {
                                label: this.translate.instant(
                                    'Documents Required'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/documentRequired'],
                            },
                            {
                                label: this.translate.instant(
                                    'getLoanPayment'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/getLoanPayment'],
                            },


                            // {
                            //     label: this.translate.instant('RESIGNATIONSETTINGS'),
                            //     icon: 'pi pi-fw pi-home',
                            //     routerLink: ['/info/resignationSetting'],
                            // },
                        ],
                    },

                    {
                        label: this.translate.instant('Notifications'),
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.75C13.1 21.75 14 20.85 14 19.75H10C10 20.85 10.9 21.75 12 21.75ZM18 15.75V10.75C18 7.68 16.37 5.11 13.5 4.43V3.75C13.5 2.92 12.83 2.25 12 2.25C11.17 2.25 10.5 2.92 10.5 3.75V4.43C7.64 5.11 6 7.67 6 10.75V15.75L4 17.75V18.75H20V17.75L18 15.75ZM16 16.75H8V10.75C8 8.27 9.51 6.25 12 6.25C14.49 6.25 16 8.27 16 10.75V16.75Z" fill="#2D3250"/>
                            </svg>

                            `),
                        items: [
                            {
                                label: this.translate.instant(
                                    'Notify All Employees'
                                ),
                                routerLink: ['/info/SendNotificationToAll'],
                            },

                            // {
                            //     label: this.translate.instant('Resignation'),
                            //     icon: 'pi pi-fw pi-home',
                            //     routerLink: ['/info/resignation'],
                            // },
                        ],
                    },
                    {
                        label: this.translate.instant('Reports'),
                        svg: this.sanitizer.bypassSecurityTrustHtml(`
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 5V14H14V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H15L21 15V5C21 3.9 20.1 3 19 3ZM12 14H7V12H12V14ZM17 10H7V8H17V10Z" fill="#2D3250"/>
                            </svg>
                            `),
                        items: [
                            // {
                            //     label: this.translate.instant(
                            //         'Notify All Employees'
                            //     ),
                            //     routerLink: ['/info/SendNotificationToAll'],
                            // },

                            {
                                label: this.translate.instant(
                                    'Attendance Reports'
                                ),
                                items: [
                                    {
                                        label: this.translate.instant(
                                            'Monthly Report'
                                        ),
                                        routerLink: ['/info/mothlyReport'],
                                    },
                                    {
                                        label: this.translate.instant(
                                            'Monthly Absence Report'
                                        ),
                                        routerLink: [
                                            '/info/mothlyAbsenceReport',
                                        ],
                                    },

                                    // {
                                    //     label: this.translate.instant('Resignation'),
                                    //     icon: 'pi pi-fw pi-home',
                                    //     routerLink: ['/info/resignation'],
                                    // },
                                ],
                            },

                            // {
                            //     label: this.translate.instant('Resignation'),
                            //     icon: 'pi pi-fw pi-home',
                            //     routerLink: ['/info/resignation'],
                            // },
                        ],
                    },
                ],
            },
        ];
    }

    ngOnInit() {
        this.initMenuItems();

        // Subscribe to language change events
        this.translate.onLangChange.subscribe(() => {
            this.initMenuItems();
        });
    }
}
