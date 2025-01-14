import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { GlobalsModule } from 'src/app/demo/modules/globals/globals.module';
import { PrimeNgModule } from 'src/app/demo/modules/primg-ng/prime-ng.module';

@Component({
  selector: 'app-mobile-version',
  standalone: true,
  imports: [GlobalsModule, PrimeNgModule],
  providers: [MessageService, TranslateService],
  templateUrl: './mobile-version.component.html',
  styleUrl: './mobile-version.component.scss'
})
export class MobileVersionComponent {

}
