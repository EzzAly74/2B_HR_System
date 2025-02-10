import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../components/info/components/loading/loading.component';
import { RequiredFieldComponent } from '../../components/info/components/custom/required-field/required-field.component';
import { BreadcrumbComponent } from '../../components/info/components/custom/breadcrumb/breadcrumb.component';

@NgModule({
  imports: [LoadingComponent, RequiredFieldComponent, BreadcrumbComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    RequiredFieldComponent,
    BreadcrumbComponent
  ],
})
export class GlobalsModule { }
