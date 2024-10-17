import { Component } from '@angular/core';
import { VacationSettingService } from './vacation-setting.service';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';

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
		startVacation!:number;
		regularVacationNumber!:number;
		maxExcuesHours!:number;
		casualVacationNumber!:number;
        id!: number;

		constructor(private messageService: MessageService,
			private _VacationSettingService:VacationSettingService) {
		}

		ngOnInit(): void {
			// set endpoint on service
			this._VacationSettingService.setEndPoint("VacationSetting");

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
