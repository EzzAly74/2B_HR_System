import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../components/info/components/loading/loading.component';

@NgModule({
  imports: [LoadingComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent
  ],
})
export class GlobalsModule { }
