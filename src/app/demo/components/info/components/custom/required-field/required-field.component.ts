import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Tooltip, TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-required-field',
  standalone: true,
  imports: [TooltipModule, ToastModule, MessageModule],
  providers: [Tooltip, MessageService],
  templateUrl: './required-field.component.html',
  styleUrls: ['./required-field.component.scss']
})
export class RequiredFieldComponent {

}
