import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { TranslateService } from '@ngx-translate/core';

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
        private translate: TranslateService
    ) {}

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
                        label: this.translate.instant('HOME'),
                        icon: 'pi pi-fw pi-home',
                        items: [
                            {
                                label: this.translate.instant('DASHBOARD'),
                                routerLink: ['/dashboard'],
                            },

                            {
                                label: this.translate.instant('TESTINPUT'),
                                routerLink: ['/info/test'],
                            },


                        ],
                    },

                    {
                        label: this.translate.instant('EMPLOYEE STRUCTURE'),
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: this.translate.instant('DEPARTMENT'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/department'],
                            },
                            {
                                label: this.translate.instant('BANK'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/bank'],
                            },
                            {
                                label: this.translate.instant('GOVERNMENT'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/government'],
                            },
                            {
                                label: this.translate.instant('GRADE'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/grade'],
                            },
                            {
                                label: this.translate.instant('JOB'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/job'],
                            },
                            {
                                label: this.translate.instant('PARTITION'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/partition'],
                            },
                            {
                                label: this.translate.instant('QUALIFICATION'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/qualification'],
                            },

                            {
                                label: this.translate.instant(
                                    'Relative Relation'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/relativeRelation'],
                            },
                            {
                                label: this.translate.instant('Contract Type'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/contractType'],
                            },
                            {
                                label: this.translate.instant('Job Nature'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/jobNature'],
                            },
                            {
                                label: this.translate.instant(
                                    'Recruitment Source'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/recuritmentSource'],
                            },
                            {
                                label: this.translate.instant(
                                    'Document Required'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/documentRequired'],
                            },
                            {
                                label: this.translate.instant('Uniform Codes'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/uniformCodes'],
                            },
                            {
                                label: this.translate.instant(
                                    'CONVENATCATEGORY'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/CovenantCategory'],
                            },
                            {
                                label: this.translate.instant('CONVENAT'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/Covenant'],
                            },
                            {
                                label: this.translate.instant('Company Policy'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/companyPolicy'],
                            },
                            {
                                label: this.translate.instant('Execuse Type'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/execuseType'],
                            },
                            {
                                label: this.translate.instant('Vacation Type'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/vacationType'],
                            },
                            {
                                label: this.translate.instant('Internal Jobs'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/InternalJobs'],
                            },
                        ],
                    },

                    {
                        label: this.translate.instant('EMPLOYEE AFFAIRS'),
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: this.translate.instant(
                                    'All Employees Covenant'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/allEmployeesCovenant'],
                            },

                            {
                                label: this.translate.instant(
                                    'All Employees File'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/allEmployeesFile'],
                            },

                            {
                                label: this.translate.instant(
                                    'All Employees Location'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/allEmployeesLocation'],
                            },

                            {
                                label: this.translate.instant(
                                    'All Employees Manager'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/allEmployeesManager'],
                            },
                            {
                                label: this.translate.instant(
                                    'All Employees Uniform'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/allEmployeesUniform'],
                            },
                            {
                                label: this.translate.instant('All Employees'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/employees'],
                            },
                            {
                                label: this.translate.instant('EMPLOYEE_DATA'),
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/info/employee'],
                            },
                            {
                                label: this.translate.instant('EMPLOYEE_FINGERPRINTs'),
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/info/fingerprints'],
                            },
                            {
                                label: this.translate.instant('LOANSTYPE'),
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/info/loanTypes'],
                            },
                        ],
                    },
                    {
                        label: this.translate.instant('SHIFT'),
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: this.translate.instant('SHIFT'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/shift'],
                            },
                            {
                                label: this.translate.instant(
                                    'Public Vacation'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/publicVacation'],
                            },
                            {
                                label: this.translate.instant('Shift Vacation'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/shiftVacation'],
                            },
                            {
                                label: this.translate.instant(
                                    'External Misson'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/externalMisson'],
                            },
                            {
                                label: this.translate.instant(
                                    'Execuse Request'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/execuseRequest'],
                            },
                            {
                                label: this.translate.instant(
                                    'Vacation Request'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/vacationRequest'],
                            },
                            {
                                label: this.translate.instant('Close Month'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/closeMonth'],
                            },
                            {
                                label: this.translate.instant('KPI'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/kpi'],
                            },
                            {
                                label: this.translate.instant('Bonus'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/bonus'],
                            },
                            {
                                label: this.translate.instant(
                                    'Penalties And Deduction'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/PenaltiesAndDeduction'],
                            },
                        ],
                    },
                    {
                        label: this.translate.instant('SETTINGS'),
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: this.translate.instant('LOCATION'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/location'],
                            },

                            {
                                label: this.translate.instant(
                                    'Vacation Settings'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/vacationSetting'],
                            },
                            {
                                label: this.translate.instant('All Users'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/users'],
                            },
                            {
                                label: this.translate.instant(
                                    'Attendance Configuration'
                                ),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/attendenceConfig'],
                            },

                            {
                                label: this.translate.instant('Employee Shifts'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/setEmployeeShifts'],
                            },
                            {
                                label: this.translate.instant('Resignation'),
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/info/resignation'],
                            },

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
