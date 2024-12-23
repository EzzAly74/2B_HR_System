import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StdPaginationsWithPopupComponent } from 'src/app/demo/components/std-paginations-with-popup/std-paginations-with-popup.component';

@Component({
  selector: 'app-loan-types',
  templateUrl: './loan-types.component.html',
  styleUrl: './loan-types.component.scss',
  providers: [MessageService],
  standalone: true,
  imports: [StdPaginationsWithPopupComponent]
})
export class LoanTypesComponent {
  
}
