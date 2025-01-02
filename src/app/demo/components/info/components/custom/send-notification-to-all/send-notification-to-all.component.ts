import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { SendToAllServiceService } from './send-to-all-service.service';

@Component({
    selector: 'app-send-notification-to-all',
    standalone: true,
    providers: [MessageService],
    imports: [GlobalsModule, PrimeNgModule],
    templateUrl: './send-notification-to-all.component.html',
    styleUrl: './send-notification-to-all.component.scss',
})
export class SendNotificationToAllComponent {
    loading: boolean = false;
    constructor(
        private sendToAllNotificationService: SendToAllServiceService,
        private messageService: MessageService
    ) { }
    @Input() endPoint!: string;
    sendAllNotificationForm: FormGroup = new FormGroup({
        title: new FormControl(null, [Validators.required]),
        body: new FormControl(null, [Validators.required]),
        isOpened: new FormControl(false),
    });
    ngOnInit() {
        this.endPoint = 'Notification';

        // adding this Configurations in each Component Customized
        Globals.getMainLangChanges().subscribe((mainLang) => {
            console.log('Main language changed to:', mainLang);

            // update mainLang at Service
            this.sendToAllNotificationService.setCulture(mainLang);

            // update endpoint
            this.sendToAllNotificationService.setEndPoint(this.endPoint);
        });
    }

    sendAllNotification(form: FormGroup) {
        this.loading = true;
        this.sendToAllNotificationService
            .SendNotificationToAll(form.value)
            .subscribe({
                next: (res) => {
                    this.loading = false;

                    if (res.success) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Notification sent successfully !',
                            life: 3000,
                        });

                        form.reset();
                    }
                },

            });
    }
}
