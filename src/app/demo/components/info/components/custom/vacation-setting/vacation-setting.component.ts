import { Component } from '@angular/core';
import { VacationSettingService } from './vacation-setting.service';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/class/globals';

@Component({
    selector: 'app-vacation-setting',
    templateUrl: './vacation-setting.component.html',
    styleUrl: './vacation-setting.component.scss',
    standalone: true,
    providers: [MessageService],
    imports: [
        GlobalsModule,
        PrimeNgModule,
    ],
})
export class VacationSettingComponent {
    // main fields
    startVacation!: number;
    regularVacationNumber!: number;
    maxExcuesHours!: number;
    casualVacationNumber!: number;
    id!: number;
    items!: any;
    endPoint!: any;

    constructor(private messageService: MessageService,
        private translate: TranslateService,
        private _VacationSettingService: VacationSettingService) {
    }

    ngOnInit(): void {
        this.endPoint = "VacationSetting"
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);
            // set endpoint on service
            this._VacationSettingService.setEndPoint(this.endPoint);

            // use function get from custom service to get data;
            this._VacationSettingService.GetAll().subscribe({
                next: (res) => {
                    // use result to get date
                    console.log(res.data);
                    let data = res.data;
                    this.startVacation = data.startVacation;
                    this.regularVacationNumber = data.regularVacationNumber;
                    this.maxExcuesHours = data.maxExcuesHours;
                    this.casualVacationNumber = data.casualVacationNumber;
                    this.id = data.id;
                },
                error: (err) => {
                    console.log(err);
                    // show an error msg here

                },
            });


            this.translate.onLangChange.subscribe(() => {
                this.updateTranslations();
            });

            this.updateTranslations();
        });

    }

    updateTranslations() {
        this.items = [
            {
                icon: 'pi pi-home',
                route: '/', label: this.translate.instant("breadcrumb.gen.home"), start: true
            },
            {
                label: this.translate.instant('breadcrumb.cats.manageStructure.title'),
                iconPath: ''
            },
            {
                label: this.translate.instant(`breadcrumb.cats.manageStructure.items.${this.endPoint}`),
            }];
    }

    onSubmit() {

        // create body request object
        let body = {
            startVacation: this.startVacation,
            regularVacationNumber: this.regularVacationNumber,
            maxExcuesHours: this.maxExcuesHours,
            casualVacationNumber: this.casualVacationNumber,
            id: this.id
        }

        // perform edit
        this._VacationSettingService.Register(body).subscribe({
            next: (res) => {
                console.log(res);

                // show success message
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'You Edit This Item',
                    life: 3000,
                });
            },
            error: (err) => {
                console.log(err);
                // show an error msg here

            },
        });
    }
}
