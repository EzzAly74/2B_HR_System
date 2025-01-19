import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../components/info/components/loading/loading.component';
import { RequiredFieldComponent } from '../../components/info/components/custom/required-field/required-field.component';

@NgModule({
  imports: [LoadingComponent, RequiredFieldComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    RequiredFieldComponent
  ],
})
export class GlobalsModule { }
