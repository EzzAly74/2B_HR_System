import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { LoanSettingsService } from './loan-settings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Globals } from 'src/app/class/globals';

@Component({
    selector: 'app-loan-settings',
    standalone: true,
    providers: [MessageService],
    imports: [GlobalsModule, PrimeNgModule],
    templateUrl: './loan-settings.component.html',
    styleUrl: './loan-settings.component.scss',
})
export class LoanSettingsComponent {
    startVacation!: number;
    regularVacationNumber!: number;
    maxExcuesHours!: number;
    casualVacationNumber!: number;
    id!: number;
    loading: boolean = false;

    loansConfigForm: FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required]),
        engName: new FormControl(null, [Validators.required]),
        loansIsOpened: new FormControl(null, [Validators.required]),
        loansPerSalary: new FormControl(null, [Validators.required]),
        numOfMonthsOfHiringDate: new FormControl(null, [Validators.required]),
        maximumLoanAmount: new FormControl(null, [Validators.required]),
        termsAgreement: new FormControl(null, [Validators.required]),
        notes: new FormControl(null),
        id: new FormControl(null, [Validators.required]),
    });

    constructor(
        private messageService: MessageService,
        private loanSettingsService: LoanSettingsService
    ) { }

    ngOnInit(): void {
        // set endpoint on service
        this.loanSettingsService.setEndPoint('LoansConfiguration');
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.loanSettingsService.setCulture(mainLang);

            // update endpoint
            this.loanSettingsService.setEndPoint('LoansConfiguration');


            // Show Loading Until Request Is Get
            this.loading = true;

            // then, load data again to lens on the changes of mainLang & endPoints Call
            this.loanSettingsService.GetAll({}).subscribe({
                next: (res) => {
                    this.loading = false;

                    let data = res.data[res.data.length - 1];
                    console.log(data);

                    if (data) {
                        this.loansConfigForm.patchValue({
                            name: data.name || null,
                            engName: data.engName || null,
                            loansIsOpened: data.loansIsOpened || null,
                            loansPerSalary: data.loansPerSalary || null,
                            numOfMonthsOfHiringDate:
                                data.numOfMonthsOfHiringDate || null,
                            maximumLoanAmount: data.maximumLoanAmount || null,
                            termsAgreement: data.termsAgreement || null,
                            notes: data.notes || null,
                            id: data.id || null,
                        });
                    }
                },

                error: () => {
                    this.loading = false;
                }
            });
        });

        // use function get from custom service to get data;
        this.loanSettingsService.GetAll({}).subscribe({
            next: (res) => {
                let data = res.data[res.data.length - 1];
                console.log(data);
                this.loading = false;

                if (data) {
                    this.loansConfigForm.patchValue({
                        name: data.name || null,
                        loansIsOpened: data.loansIsOpened || null,
                        loansPerSalary: data.loansPerSalary || null,
                        numOfMonthsOfHiringDate:
                            data.numOfMonthsOfHiringDate || null,
                        maximumLoanAmount: data.maximumLoanAmount || null,
                        termsAgreement: data.termsAgreement || null,
                        notes: data.notes || null,
                        id: data.id || null,
                    });
                }
            },

            error: () => {
                this.loading = false;
            }
        });
    }

    onSubmit(form: FormGroup) {
        console.log(form);

        this.loading = true;

        this.loanSettingsService.Register(form.value).subscribe({
            next: (res) => {
                this.loading = false;

                console.log(res);
                if (res.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'You Updated Loan Settings Successfully',
                        life: 3000,
                    });
                }
            },

            error: () => {
                this.loading = false;
            }
        });

        console.log(form);
    }
}
