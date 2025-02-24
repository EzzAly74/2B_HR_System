import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Globals } from 'src/app/class/globals';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';
import { SendToAllServiceService } from './send-to-all-service.service';
import { TranslateService } from '@ngx-translate/core';

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
    items!: any;
    constructor(
        private sendToAllNotificationService: SendToAllServiceService,
        private messageService: MessageService,
        private translate: TranslateService
    ) { }
    @Input() endPoint!: string;
    sendAllNotificationForm: FormGroup = new FormGroup({
        title: new FormControl(null, [Validators.required]),
        titleEng: new FormControl(null, [Validators.required]),
        body: new FormControl(null, [Validators.required]),
        bodyEng: new FormControl(null, [Validators.required]),
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


            // add bread-crumbs
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
                label: this.translate.instant('breadcrumb.cats.notifications.title'),
                iconPath: ''
            },
            {
                label: this.translate.instant(`breadcrumb.cats.notifications.items.${this.endPoint}`),
            }];
    }


    sendAllNotification(form: FormGroup) {

        let body = {
            ...form.value,
            isOpened: true,
        }

        this.loading = true;
        this.sendToAllNotificationService
            .SendNotificationToAll(body)
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

                error: () => {
                    this.loading = false
                }

            });
    }
}
