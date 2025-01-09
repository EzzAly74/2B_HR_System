import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TreeTableService } from 'primeng/treetable';

@Component({
  selector: 'pre-loading',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  providers: [TreeTableService]
})
export class LoadingComponent {

}
