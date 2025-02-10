import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  providers: [MessageService, TranslateService],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ngOnInit() {
    // this.items = [{ icon: 'pi pi-home', route: '/' }, { label: 'Components' }, { label: 'Form' }, { label: 'InputText', route: '/inputtext' }];
  }
}
